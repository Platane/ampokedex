# pokeapi

avoid putting too much pressure on the pokeapi endpoint.

- limit the request concurrency to 1
- wait 100ms after each request before starting the next one
- cache locally the responses ( for dev, and CI as we use CI cache utils )
