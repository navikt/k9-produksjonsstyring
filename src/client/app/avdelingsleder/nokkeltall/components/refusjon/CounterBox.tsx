import React from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getOppgaverPerDato } from 'avdelingsleder/nokkeltall/duck';
import { getValuesFromReduxState } from 'form/reduxBinding/formDuck';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { MottattPanel } from 'avdelingsleder/nokkeltall/components/refusjon/MottattPanel';


interface TsProps {
    count: number;
    period: string;
    color?: boolean;
}


const StyledBorder = styled.div`
  height: 200px;
  width: 280px;
  background-color: #FFFFFF;
  box-shadow: 0 0 5px 1px rgba(0,0,0,0.2);
  float :left;
  margin-right: 32px;
`;

const StyledNumbersPanel = styled.div`
  height: 140px;
  width: 280px;
  margin-top: auto;
  color: #3E3832;
  font-family: "Source Sans Pro Light";
  font-size: 90px;
  font-weight: 300;
  letter-spacing: 0;
  text-align: center;
`;

const StyledLine = styled.hr`
  background: #979797;
  width: 90%;
  height: 1px;
  margin-top: auto;
  visibility: ${props => (props.color ? 'hidden' : 'visible')};
`;

const StyledPeriodPanel = styled.div`
  height: 60px;
  width: 280px;
  color: #3E3832;
  font-family: "Source Sans Pro";
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 8px;
  text-align: center;
  margin-top: 10px;
`;


const CounterBox = ({
                      count, period, color,
                  }: TsProps) => (
                    <StyledBorder>
                      <StyledNumbersPanel>
                        {count}
                        <StyledLine />
                      </StyledNumbersPanel>
                      <StyledPeriodPanel>
                        {period}
                      </StyledPeriodPanel>
                    </StyledBorder>
);

export default CounterBox;
