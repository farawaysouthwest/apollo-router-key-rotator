source .env &&
rover graph introspect https://api.apollographql.com/graphql --header 'X-API-KEY: $APOLLO_KEY' --header 'apollographql-client-name: supergraph-key-rotator' --header 'apollographql-client-version:1.0' > schema.graphql