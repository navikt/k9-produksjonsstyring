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

NB: Husk at få lagt in azure-mock i /etc/hosts i k9-verdikjede`slik att azure-mock mappes til localhost. Hvis ikke dette er utført får man følgende feilmelding: ErrorCaused by: java.net.UnknownHostException: azure-mock.

Verdi som ska legges in i hosts filen:
````
127.0.0.1 azure-mock
````

2. Last ned [k9-los-api](https://github.com/navikt/k9-los-api). Start klassen no.nav.k9.K9LosDev med vm-options under. Bytt ut path til riktig for trustStore og keyStore. 

Eksempel fra Windows miljø
````
-Djavax.net.ssl.trustStore=/Users/specifik_users_name/.modig/trustStore.jks -Djavax.net.ssl.keyStore=/Users/specifik_users_name/.modig/keyStore.jks -Djavax.net.ssl.trustStorePassword=changeit -Djavax.net.ssl.keyStorePassword=devillokeystore1234
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
Mock e-postadresse som kan brukes for og legge til saksbehandler i køer.
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
