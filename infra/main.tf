
provider "google" {
  region = "us-central1"
  zone   = "us-central1-c"
}
resource "google_service_account" "key-rotator" {
  account_id = "key-rotator"
}

resource "google_service_account_key" "key-rotator" {
  service_account_id = google_service_account.key-rotator.id
  public_key_type    = "TYPE_X509_PEM_FILE"
}


resource "google_secret_manager_secret" "supergraph_api_key" {
  secret_id = upper("${var.graph_variant}_supergraph_api_key")

  labels = {
    environment = var.graph_variant
  }

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_iam_member" "supergraph_api_key_grant" {
  secret_id = google_secret_manager_secret.supergraph_api_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.key-rotator.email}"
}

resource "google_cloudfunctions_function" "main" {
  name        = "${var.graph_variant}-apollo-router-key-rotator"
  description = "Creates and rotates secure api keys for communication between cloud router and subgraphs."
  runtime     = "nodejs16"

  available_memory_mb          = 256
  trigger_http                 = true
  https_trigger_security_level = "SECURE_ALWAYS"
  timeout                      = 60
  entry_point                  = "main"
  service_account_email        = "serviceAccount:${google_service_account.key-rotator.email}"
  labels = {
    my-label = var.graph_variant
  }

  environment_variables = {
    APOLLO_API_URI = "https://graphql.api.apollographql.com/api/graphql"
    APOLLO_KEY     = var.apollo_key
    GRAPH_ID       = var.graph_id
    GRAPH_VARIANT  = var.graph_variant
    SECRET_NAME    = google_secret_manager_secret.supergraph_api_key.name
  }
}

# IAM entry for a single user to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.main.project
  region         = google_cloudfunctions_function.main.region
  cloud_function = google_cloudfunctions_function.main.name

  role   = "roles/cloudfunctions.invoker"
  member = "serviceAccount:${google_service_account.key-rotator.email}"
}

resource "google_cloud_scheduler_job" "job" {
  name             = "${var.graph_variant}-key-rotation"
  description      = "schedualed task for graphql key rotation"
  schedule         = "0 0 1 * *" # monthly
  time_zone        = "America/New_York"
  attempt_deadline = "320s"

  http_target {
    http_method = "GET"
    uri         = google_cloudfunctions_function.main.https_trigger_url

    oauth_token {
      service_account_email = google_service_account.key-rotator.email
    }
  }
}

