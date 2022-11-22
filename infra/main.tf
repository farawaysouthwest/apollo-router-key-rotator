
provider "google" {
  credentials = file("<NAME>.json")

  project = "<PROJECT_ID>"
  region  = "us-central1"
  zone    = "us-central1-c"
}

resource "google_secret_manager_secret" "name" {

}


resource "google_cloudfunctions2_function" "main" {
  name        = "function-test"
  description = "My function"
  runtime     = "nodejs16"

  available_memory_mb          = 128
  trigger_http                 = true
  https_trigger_security_level = "SECURE_ALWAYS"
  timeout                      = 60
  entry_point                  = "main"
  labels = {
    my-label = var.stack
  }

  environment_variables = {
    MY_ENV_VAR = "my-env-var-value"
  }
}
