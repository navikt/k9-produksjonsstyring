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
 // fetchFptilbakeUrl: () => void;
 // fetchFeatureToggles: () => void;
}>

class AppConfigResolver extends Component<TsProps> {
  static propTypes = {
    finishedLoadingBlockers: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    fetchNavAnsatt: PropTypes.func.isRequired,
    fetchKodeverk: PropTypes.func.isRequired,
    fetchK9sakUrl: PropTypes.func.isRequired,
 //   fetchFptilbakeUrl: PropTypes.func.isRequired,
 //   fetchFeatureToggles: PropTypes.func.isRequired,
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
  //    fetchFptilbakeUrl,
  //    fetchFeatureToggles,
    } = this.props;

    fetchNavAnsatt();
    fetchKodeverk();
    fetchK9sakUrl();
 //   fetchFptilbakeUrl();
 //   fetchFeatureToggles();
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
//    k9LosApi.FPTILBAKE_URL.getRestApiFinished()(state),
//    k9LosApi.FEATURE_TOGGLES.getRestApiFinished()(state),
  ];
  return {
    finishedLoadingBlockers: blockers.every(finished => finished),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchNavAnsatt: k9LosApi.NAV_ANSATT.makeRestApiRequest(),
  fetchKodeverk: k9LosApi.KODEVERK.makeRestApiRequest(),
  fetchK9sakUrl: k9LosApi.K9SAK_URL.makeRestApiRequest(),
//  fetchFptilbakeUrl: k9LosApi.FPTILBAKE_URL.makeRestApiRequest(),
//  fetchFeatureToggles: k9LosApi.FEATURE_TOGGLES.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigResolver);
