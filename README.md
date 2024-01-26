# Komme i gang

## Dependencies

`k9-los-web` har dependencies til pakker publisert fra [k9-saksbehandling-frontend](https://github.com/navikt/k9-saksbehandling-frontend).

## Oppsett for Lokal Utvikling

### Autentisering med GitHub's Package Registry

Før du kjører `yarn install`, sett opp lokal NPM for autentisering mot GitHub ved hjelp av en Personal Access Token (PAT) med `read:packages`-tilgang. For mer informasjon, se den [offisielle GitHub-guiden](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

**Korte Trinn**:

1. Opprett en GitHub PAT med `read:packages`-tilgang.
2. Aktiver SSO.
3. Legg følgende i `~/.yarnrc.yml`:

   ```yaml
   npmRegistries:
     https://npm.pkg.github.com:
       npmAlwaysAuth: true
       npmAuthToken: <token>
   ```

⚠️ Merk: Dette skal ikke sjekkes inn i versjonskontroll.

#### Lokal utvikling

0. Legg inn azure-mock i /etc/hosts. Hvis ikke dette er utført får man følgende feilmelding: ErrorCaused by: java.net.UnknownHostException: azure-mock.
   Verdi som skal legges inn i hosts filen:
```

127.0.0.1 azure-mock

```

1. Kjør opp docker-containerene i verdikjede (https://github.com/navikt/k9-verdikjede) 
```
   docker-compose up -d k9-los
```
2. Kjør opp k9-los-web lokalt med yarn dev
3. Opprett ønsket kø i avdelingslederpanelet og legg til saksbehandler i køen
4. Kjør tester i verdikjede for å opprette saker. Man kan slette deler av testene for å få behandlinger som ikke er ferdigstilt.
   Les dokumentasjon i https://github.com/navikt/k9-verdikjede for å kjøre tester.
5. Det KAN hende localhost:8020/mock kan brukes for å opprette oppgaver i LOS.
   Vedlikehold av denne mocken er ikke prioritert og den kan derfor være utdatert og ustabil.

Nå kan du søke opp saksnummeret eller søkeren i k9-los-web. Dersom oppgaven matcher kriteriene i en av dine køer vil den også dukke opp i listen over oppgaver.

##### Mock Service Worker

MSW kan brukes til å enkelt mocke API-requests.
Definer hvilket API som skal mockes og hva som skal returneres i handlers.js
Kjør opp applikasjonen med følgende kommando for å bruke mockdata fra handlers.js
Dette er mest nyttig dersom man skal teste en spesifikk case som er vanskelig å få til med ekte data.
Ellers er det anbefalt å benytte verdikjede for å få mest mulig likt oppsett som i produksjon.

```

MSW_MODE=test yarn dev

```

#### Windows oppsett

For att kjøre vtp som fungerer for LOS lokalt kan det hente att man må specifisere path til modig i docker-compose.

```

C:/Users/xxxxxxx/.modig:/app/.modig

```

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen **#k9-los**.
