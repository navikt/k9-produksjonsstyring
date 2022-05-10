import React from 'react';
import { screen } from '@testing-library/react';
import ErrorMessagePanel from './ErrorMessagePanel';
import {renderWithAllProviders, renderWithIntl} from "../../../../../setup/testHelpers/testUtils";
import EventType from "api/rest-api/src/requestApi/eventType";


describe('<ErrorMessagePanel>', () => {
  it('skal vise feilmelding', () => {
    const errorMsg = 'Error!';
    renderWithAllProviders(<ErrorMessagePanel
      errorMessages={[]}
      queryStrings={{
        errormessage: errorMsg,
      }}
      removeErrorMessages={() => undefined}
    />);

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
    expect(screen.queryAllByRole('a')).toHaveLength(0);
  });

  it('skal erstatte spesialtegn i feilmelding', () => {
    const errorMsg = 'Høna &amp; egget og &#34;test1&#34; og &#39;test2&#39;';
    renderWithAllProviders(<ErrorMessagePanel
      errorMessages={[]}
      queryStrings={{
        errormessage: errorMsg,
      }}
      removeErrorMessages={() => undefined}
    />);

    expect(screen.getByText("Høna & egget og \"test1\" og 'test2'")).toBeInTheDocument();
  });

  it('skal sette sammen feil fra ulike kilder til en struktur', () => {
    renderWithAllProviders(<ErrorMessagePanel
      errorMessages={[{
        type: EventType.REQUEST_ERROR,
        text: 'Feilet',
      }]}
      queryStrings={{
        errormessage: 'Dette er en feil',
      }}
      removeErrorMessages={() => undefined}
    />);

    expect(screen.getByText('Dette er en feil')).toBeInTheDocument();
    expect(screen.getByText('Feilet')).toBeInTheDocument();
  });
});