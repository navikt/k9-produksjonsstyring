import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import k9LosApi from 'api/k9LosApi';
import LoadingPanel from 'sharedComponents/LoadingPanel';

type TsProps = Readonly<{
  finishedLoadingBlockers: boolean;
  children: ReactNode;
  fetchNavAnsatt: () => void;
  fetchKodeverk: () => void;
  fetchK9sakUrl: () => void;
  fetchSseUrl: () => void;
  fetchDriftsmeldinger: () => void;
}>

class AppConfigResolver extends Component<TsProps> {
  static propTypes = {
    finishedLoadingBlockers: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    fetchNavAnsatt: PropTypes.func.isRequired,
    fetchKodeverk: PropTypes.func.isRequired,
    fetchK9sakUrl: PropTypes.func.isRequired,
    fetchSseUrl: PropTypes.func.isRequired,
    fetchDriftsmeldinger: PropTypes.func.isRequired,
  };

  constructor(props: TsProps) {
    super(props);
    this.resolveAppConfig();
  }

  resolveAppConfig = () => {
    const {
      fetchNavAnsatt,
      fetchKodeverk,
      fetchK9sakUrl,
      fetchSseUrl,
      fetchDriftsmeldinger,
    } = this.props;

    fetchNavAnsatt();
    fetchKodeverk();
    fetchK9sakUrl();
    fetchSseUrl();
    fetchDriftsmeldinger();
  }

  render = () => {
    const { finishedLoadingBlockers, children } = this.props;
    if (!finishedLoadingBlockers) {
      return <LoadingPanel />;
    }
    return children;
  }
}

const mapStateToProps = (state: any) => {
  const blockers = [
    k9LosApi.NAV_ANSATT.getRestApiFinished()(state),
    k9LosApi.KODEVERK.getRestApiFinished()(state),
    k9LosApi.K9SAK_URL.getRestApiFinished()(state),
    k9LosApi.SSE_URL.getRestApiFinished()(state),
    k9LosApi.DRIFTSMELDINGER.getRestApiFinished()(state),
  ];
  return {
    finishedLoadingBlockers: blockers.every((finished) => finished),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchNavAnsatt: k9LosApi.NAV_ANSATT.makeRestApiRequest(),
  fetchKodeverk: k9LosApi.KODEVERK.makeRestApiRequest(),
  fetchK9sakUrl: k9LosApi.K9SAK_URL.makeRestApiRequest(),
  fetchSseUrl: k9LosApi.SSE_URL.makeRestApiRequest(),
  fetchDriftsmeldinger: k9LosApi.DRIFTSMELDINGER.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigResolver);
