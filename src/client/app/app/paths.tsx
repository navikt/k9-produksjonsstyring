import { formatQueryString, parseQueryString } from 'utils/urlUtils';
import { Location } from './locationTsType';

export const AVDELINGSLEDER_PATH = 'avdelingsleder';

const emptyQueryString = queryString => queryString === '?' || !queryString;

const updateQueryParams = (queryString, nextParams) => {
  const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
  return formatQueryString({
    ...prevParams,
    ...nextParams,
  });
};

const getLocationWithQueryParams = (location, queryParams) => ({ ...location, search: updateQueryParams(location.search, queryParams) });

export const getAvdelingslederPanelLocationCreator = (location: Location) => (avdelingslederPanel: string) => getLocationWithQueryParams(
  location, { fane: avdelingslederPanel },
);

export const getK9sakHref = (k9sakUrl: string, saksnummer: string, behandlingId?: number) => (behandlingId
  ? `${k9sakUrl}/fagsak/${saksnummer}/behandling/${behandlingId}/?punkt=default&fakta=default?kilde=k9-los`
    : `${k9sakUrl}/fagsak/${saksnummer}/?kilde=k9-los`);

export const getK9tilbakeHref = (k9tilbakeUrl: string, saksnummer: string, eksternId?: string) => (eksternId
    ? `${k9tilbakeUrl}/tilbake/${saksnummer}/behandling/${eksternId}/?punkt=default&fakta=default?kilde=k9-los`
    : `${k9tilbakeUrl}/tilbake/${saksnummer}/?kilde=k9-los`);
