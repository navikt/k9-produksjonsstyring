import React from 'react';
import {
  filtrereNyePerDato,
  sjekkOmOppgaveSkalLeggesTil,
  slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver,
  slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver,
  slaSammenLikeBehandlingstyperOgDatoer, slaSammenPunsjBehandlingstyperOgDatoer
} from "avdelingsleder/nokkeltall/nokkeltallUtils";
import nyeOgFerdigstilteOppgaver from "../../../mocks/nyeOgFerdigstilteOppgaver";
import fagsakYtelseType from "kodeverk/fagsakYtelseType";
import ferdigstilteHistorikk from "../../../mocks/ferdigstilteHistorikk";

describe('<NokkeltallUtils>', () => {
  it('skal slå sammen like behandlingstyper og datoer for historikk data', () => {
    const sammenslåttHistorikkOppgaver = slaSammenLikeBehandlingstyperOgDatoer(ferdigstilteHistorikk);

    const sammenslåttHistorikkOppgaverForstegangsbehandling = sammenslåttHistorikkOppgaver.find(oppgave =>
      oppgave.behandlingType.navn === 'Førstegangsbehandling'
      && oppgave.dato === '2021-08-29'
      && oppgave.antall === 3);

    const sammenslåttHistorikkOppgaverRevurdering = sammenslåttHistorikkOppgaver.find(oppgave =>
      oppgave.behandlingType.navn === 'Revurdering'
      && oppgave.dato === '2021-08-29'
      && oppgave.antall === 4);

    const sammenslåttHistorikkOppgaverTilbakekreving29August = sammenslåttHistorikkOppgaver.find(oppgave =>
      oppgave.behandlingType.navn === 'Tilbakekreving'
      && oppgave.dato === '2021-08-29'
      && oppgave.antall === 1);

    const sammenslåttHistorikkOppgaverTilbakekreving30August = sammenslåttHistorikkOppgaver.find(oppgave =>
      oppgave.behandlingType.navn === 'Tilbakekreving'
      && oppgave.dato === '2021-08-30'
      && oppgave.antall === 1);

    expect(sammenslåttHistorikkOppgaverRevurdering).toBeTruthy();
    expect(sammenslåttHistorikkOppgaverForstegangsbehandling).toBeTruthy();
    expect(sammenslåttHistorikkOppgaverTilbakekreving29August).toBeTruthy();
    expect(sammenslåttHistorikkOppgaverTilbakekreving30August).toBeTruthy();
  });

  it('skal slå sammen alle punsj behandlingstyper for historikk data', () => {
    const sammenslåttHistorikkOppgaverForPunsj = slaSammenPunsjBehandlingstyperOgDatoer(ferdigstilteHistorikk);

    const sammenslåttHistorikkOppgaverPunsj29August = sammenslåttHistorikkOppgaverForPunsj.find(oppgave =>
      oppgave.behandlingType.navn === 'PUNSJ'
      && oppgave.dato === '2021-08-29'
      && oppgave.antall === 11);

    const sammenslåttHistorikkOppgaverPunsj30August = sammenslåttHistorikkOppgaverForPunsj.find(oppgave =>
      oppgave.behandlingType.navn === 'PUNSJ'
      && oppgave.dato === '2021-08-30'
      && oppgave.antall === 1);


    expect(sammenslåttHistorikkOppgaverPunsj29August).toBeTruthy();
    expect(sammenslåttHistorikkOppgaverPunsj30August).toBeTruthy();

  });

  it('skal slå sammen like behandlingstyper og datoer for nye og ferdigstilte oppgaver', () => {
    const sammenslåttNyeOgFerdigstilleOppgaver = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(nyeOgFerdigstilteOppgaver);

    const sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverForstegangsbehandling = sammenslåttNyeOgFerdigstilleOppgaver.find(oppgave =>
      oppgave.behandlingType.navn === 'Førstegangsbehandling'
      && oppgave.dato === '2021-08-29'
      && oppgave.antallNye === 3
      && oppgave.antallFerdigstilte === 3
      && oppgave.antallFerdigstilteMine === 3);

    const sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverTilbakekreving = sammenslåttNyeOgFerdigstilleOppgaver.find(oppgave =>
      oppgave.behandlingType.navn === 'Tilbakekreving'
      && oppgave.dato === '2021-08-29'
      && oppgave.antallNye === 2
      && oppgave.antallFerdigstilte === 2
      && oppgave.antallFerdigstilteMine === 3);

    const sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverRevurdering = sammenslåttNyeOgFerdigstilleOppgaver.find(oppgave =>
      oppgave.behandlingType.navn === 'Revurdering'
      && oppgave.dato === '2021-08-29'
      && oppgave.antallNye === 2
      && oppgave.antallFerdigstilte === 2
      && oppgave.antallFerdigstilteMine === 2);

    const sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverPapirettersendelse = sammenslåttNyeOgFerdigstilleOppgaver.find(oppgave =>
      oppgave.behandlingType.navn === 'Papirettersendelse'
      && oppgave.dato === '2021-08-29'
      && oppgave.antallNye === 1
      && oppgave.antallFerdigstilte === 1
      && oppgave.antallFerdigstilteMine === 1);

    expect(sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverForstegangsbehandling).toBeTruthy();
    expect(sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverTilbakekreving).toBeTruthy();
    expect(sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverRevurdering).toBeTruthy();
    expect(sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverPapirettersendelse).toBeTruthy();
  });

  it('skal slå sammen alle punsj behandlingstyper for nye og ferdigstilte oppgaver', () => {
    const sammenslåttNyeOgFerdigstilleOppgaverForPunsj = slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver( nyeOgFerdigstilteOppgaver.filter(
      (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, oppgave),
    ));

    const sammenslåttePunsjBehandlingstyper29Aug = sammenslåttNyeOgFerdigstilleOppgaverForPunsj.find(oppgave =>
      oppgave.dato === '2021-08-29'
      && oppgave.antallNye === 10
      && oppgave.antallFerdigstilte === 10
      && oppgave.antallFerdigstilteMine === 10);

    const sammenslåttePunsjBehandlingstyper20Aug = sammenslåttNyeOgFerdigstilleOppgaverForPunsj.find(oppgave =>
      oppgave.dato === '2021-08-20'
      && oppgave.antallNye === 1
      && oppgave.antallFerdigstilte === 1
      && oppgave.antallFerdigstilteMine === 1);

    expect(sammenslåttePunsjBehandlingstyper29Aug).toBeTruthy();
    expect(sammenslåttePunsjBehandlingstyper20Aug).toBeTruthy();

  });

  it('sjekk om oppgave skal legges til basert på ytelse valgt', () => {
    const punsjOppgave = {
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger sykt barn',
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      },
      behandlingType: {
        kode: 'INNLOGGET_CHAT',
        navn: 'Innlogget chat',
        kodeverk: 'PUNSJ_INNSENDING_TYPE',
      },
      dato: '2021-08-20',
      antallNye: 1,
      antallFerdigstilte: 1,
      antallFerdigstilteMine: 1,
    };
    const OMPOppgave = {
      fagsakYtelseType: {
        kode: 'OMP',
        navn: 'Omsorgspenger',
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      },
      behandlingType: {
        kode: 'BT-007',
        navn: 'Tilbakekreving',
        kodeverk: 'ae0203',
      },
      dato: '2021-08-12',
      antallNye: 1,
      antallFerdigstilte: 1,
      antallFerdigstilteMine: 1,
    };
    const OMDOppgave = {
      fagsakYtelseType: {
        kode: 'OMP_MA',
        navn: 'Omsorgsdager: midlertidig alene',
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      },
      behandlingType: {
        kode: 'BT-004',
        navn: 'Revurdering',
        kodeverk: 'ae0028',
      },
      dato: '2021-08-12',
      antallNye: 1,
      antallFerdigstilte: 1,
      antallFerdigstilteMine: 1,
    };
    const PSBOppgave = {
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger sykt barn',
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      },
      behandlingType: {
        kode: 'BT-007',
        navn: 'Tilbakekreving',
        kodeverk: 'ae0203',
      },
      dato: '2021-08-12',
      antallNye: 1,
      antallFerdigstilte: 1,
      antallFerdigstilteMine: 2,
    };

    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, punsjOppgave)).toBe(true);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, punsjOppgave)).toBe(false);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, punsjOppgave)).toBe(false);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, punsjOppgave)).toBe(false);

    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, OMPOppgave)).toBe(false);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, OMPOppgave)).toBe(false);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, OMPOppgave)).toBe(true);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, OMPOppgave)).toBe(false);

    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, OMDOppgave)).toBe(false);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, OMDOppgave)).toBe(true);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, OMDOppgave)).toBe(false);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, OMDOppgave)).toBe(false);

    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, PSBOppgave)).toBe(false);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, PSBOppgave)).toBe(false);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, PSBOppgave)).toBe(false);
    expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, PSBOppgave)).toBe(true);
  });

  it('sjekk om oppgave filtreras basert på om punsj er valgt eller ikke', () => {
    const gårdagensDato = new Date();
    gårdagensDato.setDate(gårdagensDato.getDate()-3);

    const nyePerDato = [{
      fagsakYtelseType: {
        kode: 'OMP',
        navn: 'Omsorgspenger',
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      },
      behandlingType: {
        kode: 'BT-002',
        navn: 'Førstegangsbehandling',
        kodeverk: 'ae0034',
      },
      dato: `${gårdagensDato.getFullYear()}-${gårdagensDato.getMonth()+1}-${gårdagensDato.getDate()}`,
      antall: 1,
    },
      {
        fagsakYtelseType: {
          kode: 'PSB',
          navn: 'Pleiepenger sykt barn',
          kodeverk: 'FAGSAK_YTELSE_TYPE',
        },
        behandlingType: {
          kode: 'BT-007',
          navn: 'Tilbakekreving',
          kodeverk: 'ae0203',
        },
        dato: `${gårdagensDato.getFullYear()}-${gårdagensDato.getMonth()+1}-${gårdagensDato.getDate()}`,
        antall: 1,
      },
      {
        fagsakYtelseType: {
          kode: 'OMP',
          navn: 'Omsorgspenger',
          kodeverk: 'FAGSAK_YTELSE_TYPE',
        },
        behandlingType: {
          kode: 'BT-004',
          navn: 'Revurdering',
          kodeverk: 'ae0028',
        },
        dato: `${gårdagensDato.getFullYear()}-${gårdagensDato.getMonth()+1}-${gårdagensDato.getDate()}`,
        antall: 2,
      },
      {
        fagsakYtelseType: {
          kode: 'OMP_MA',
          navn: 'Omsorgspenger',
          kodeverk: 'FAGSAK_YTELSE_TYPE',
        },
        behandlingType: {
          kode: 'BT-004',
          navn: 'Revurdering',
          kodeverk: 'ae0028',
        },
        dato: `${gårdagensDato.getFullYear()}-${gårdagensDato.getMonth()+1}-${gårdagensDato.getDate()}`,
        antall: 2,
      },
      {
        fagsakYtelseType: {
          kode: 'OMP_KS',
          navn: 'Omsorgspenger',
          kodeverk: 'FAGSAK_YTELSE_TYPE',
        },
        behandlingType: {
          kode: 'BT-004',
          navn: 'Revurdering',
          kodeverk: 'ae0028',
        },
        dato: `${gårdagensDato.getFullYear()}-${gårdagensDato.getMonth()+1}-${gårdagensDato.getDate()}`,
        antall: 2,
      },
      {
        fagsakYtelseType: {
          kode: 'OMP_AO',
          navn: 'Omsorgspenger',
          kodeverk: 'FAGSAK_YTELSE_TYPE',
        },
        behandlingType: {
          kode: 'BT-004',
          navn: 'Revurdering',
          kodeverk: 'ae0028',
        },
        dato: `${gårdagensDato.getFullYear()}-${gårdagensDato.getMonth()+1}-${gårdagensDato.getDate()}`,
        antall: 2,
      },
      {
        fagsakYtelseType: {
          kode: 'PSB',
          navn: 'Pleiepenger sykt barn',
          kodeverk: 'FAGSAK_YTELSE_TYPE',
        },
        behandlingType: {
          kode: 'SAMTALEREFERAT',
          navn: 'Samtalereferat',
          kodeverk: 'PUNSJ_INNSENDING_TYPE',
        },
        dato: `${gårdagensDato.getFullYear()}-${gårdagensDato.getMonth()+1}-${gårdagensDato.getDate()}`,
        antall: 1,
      }]

    const filtrerteIkkePunsjOppgaverYtelsetypeOMPValgt = filtrereNyePerDato(fagsakYtelseType.OMSORGSPENGER, '4', nyePerDato);
    const filtrerteIkkePunsjOppgaverYtelsetypeOMPMAValgt = filtrereNyePerDato(fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE, '4', nyePerDato);
    const filtrerteIkkePunsjOppgaverYtelsetypeOMPKSValgt = filtrereNyePerDato(fagsakYtelseType.OMSORGSDAGER_KRONISKSYK, '4', nyePerDato);
    const filtrerteIkkePunsjOppgaverYtelsetypeOMPAOValgt = filtrereNyePerDato(fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN, '4', nyePerDato);
    const filtrerteIkkePunsjOppgaverYtelsetypePSBValgt = filtrereNyePerDato(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, '4', nyePerDato);
    const filtrertePunsjOppgaver = filtrereNyePerDato(fagsakYtelseType.PUNSJ, '4', nyePerDato);

    expect(filtrerteIkkePunsjOppgaverYtelsetypeOMPValgt).toHaveLength(2);
    expect(filtrerteIkkePunsjOppgaverYtelsetypePSBValgt).toHaveLength(1);
    expect(filtrerteIkkePunsjOppgaverYtelsetypeOMPMAValgt).toHaveLength(1);
    expect(filtrerteIkkePunsjOppgaverYtelsetypeOMPKSValgt).toHaveLength(1);
    expect(filtrerteIkkePunsjOppgaverYtelsetypeOMPAOValgt).toHaveLength(1);
    expect(filtrertePunsjOppgaver).toHaveLength(1);
  });
});
