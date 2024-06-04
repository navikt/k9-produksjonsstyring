Workspace for e2e-tester for k9-los-web med Playwright.

# Komme i gang

1.  For å kunne kjøre testene i dette prosjektet må saksbehandlingsstacken kjøre lokalt (se [utvikleroppsett for k9-verdikjede](https://github.com/navikt/k9-verdikjede/tree/master/docs/utvikleroppsett)).
2.  Kjør opp docker-containerene i verdikjede (https://github.com/navikt/k9-verdikjede)

Kjør opp verdikjeden inkl k9-los-web.

```
   docker-compose up -d k9-los-web
```

Dersom du vil kjøre frontend lokalt selv kan du skrive følgende.

```
    docker-compose up -d k9-los
```

Se README.md i root for mer info angående kjøring av k9-sak-web utenfor docker

3. Etter at verdikjeden er oppe, kjør LosFrontendTest i k9-verdikjede. Dette vil opprette en sak med saksnummer, f.eks. xyz, som må hentes fra konsollet.
4. yarn test:e2e i /e2e for å kjøre testene, sett SAKSNUMMER=xyz som miljøvariabel
