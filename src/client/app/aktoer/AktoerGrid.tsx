import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { getK9punsjRef, getK9sakHref, getOmsorgspengerRef } from 'app/paths';
import Oppgave from 'saksbehandler/oppgaveTsType';
import PersonInfo from 'saksbehandler/fagsakSearch/components/person/PersonInfo';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import Lenke from 'nav-frontend-lenker';
import useGlobalStateRestApiData from '../api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import styles from './aktoerGrid.less';
import OppgaveSystem from '../types/OppgaveSystem';

interface OwnProps {
    resultat: SokeResultat;
}

export const AktoerGrid: FunctionComponent<OwnProps> = ({ resultat }) => {
  const k9sakUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.K9SAK_URL);
  const k9punsjUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.PUNSJ_URL);
  const omsorgspengerUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.OMSORGSPENGER_URL);

  const getUrl = (oppgave: Oppgave) => {
    if (oppgave.system === OppgaveSystem.PUNSJ) {
      return getK9punsjRef(k9punsjUrl.verdi, oppgave.journalpostId);
    }
    if (oppgave.system === OppgaveSystem.OMSORGSPENGER) {
      return getOmsorgspengerRef(omsorgspengerUrl.verdi, oppgave.saksnummer);
    }
    return getK9sakHref(k9sakUrl.verdi, oppgave.saksnummer, oppgave.behandlingId);
  };

  return (
    <div className={styles.list}>
      {resultat.person && (
        <div className={styles.personInfo}>
          <PersonInfo
            person={resultat.person}
          />
        </div>
      )}
      {resultat.oppgaver.length ? (
        resultat.oppgaver.map((oppgave) => (
          <Lenkepanel
            linkCreator={(props) => (
              <Lenke href={getUrl(oppgave)} className={props.className}>
                {props.children}
              </Lenke>
            )}
            key={oppgave.saksnummer}
            href="#"
            tittelProps="normaltekst"
          >
            {` ${oppgave.saksnummer} `}
            {` ${oppgave.fagsakYtelseType.navn} `}
          </Lenkepanel>
        ))
      ) : (
        <FormattedMessage id="AktoerGrid.IngenFagsaker" />
      )}
    </div>
  );
};

export default AktoerGrid;
