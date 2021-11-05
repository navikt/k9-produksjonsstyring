## Komme i gang

k9-los-web har dependencies til pakker publisert fra [k9-frontend-modules](https://github.com/navikt/k9-frontend-modules).

For å få hentet pakker fra GitHub sitt pakkeregistry må man sette opp lokal NPM med autentisering mot GitHub med en Personal Access Token (PAT) med `read:packages`-tilgang i lokalt utviklingsmiljø, før man gjør `yarn install`. GitHub har en guide på hvordan man gjør dette [her](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

TLDR er å opprette en GitHub PAT med kun `read:packages`-tilgang, enable SSO, og putte det i en egen ~/.npmrc-fil slik:

```
//npm.pkg.github.com/:_authToken=<token>
```

Merk at dette _ikke_ skal sjekkes inn i versjonskontroll.

Når dette er gjort kan man kjøre dette på rot av repo'et for å kjøre opp lokalt utviklingsmiljø:

```
yarn install
yarn dev
```

## Lokal utvikling

1. Kjør vtp, postgres og azure mocks fra [k9-verdikjede](https://github.com/navikt/k9-verdikjede/tree/master/saksbehandling).
````
docker-compose up vtp postgres azure-mock
````
2. Last ned [k9-los-api](https://github.com/navikt/k9-los-api). Start klassen no.nav.k9.K9LosDev med vm-options
````
-Djavax.net.ssl.trustStore=/Users/.../.modig/trustStore.jks -Djavax.net.ssl.keyStore=/Users/.../.modig/keyStore.jks -Djavax.net.ssl.trustStorePassword=changeit -Djavax.net.ssl.keyStorePassword=devillokeystore1234
````
3. 
````
yarn dev
````

#### Nyttig informasjon for lokal utvikling
Mocke oppgaver i backend
````
http://localhost:8020/mock
````
Kan legges til som saksbehandler
````
saksbehandler@nav.no
````

#### Windows oppsett
For att kjøre vtp som fungerer for LOS lokalt kan det hente att man må specifisere path til modig i docker-compose.
````
C:/Users/xxxxxxx/.modig:/app/.modig
````

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen **#sif_saksbehandling**.
