import ArbeidsforholdId from './arbeidsforholdIdTsType';
import Arbeidsgiver from './arbeidsgiverTsType';
import Inntektsmelding from './inntektsmeldingTsType';
import Kodeverk from './kodeverkTsType';
import Periode from './periodeTsType';

type Arbeidsforhold = Readonly<{
  id?: string;
  arbeidsforhold?: ArbeidsforholdId;
  arbeidsgiver?: Arbeidsgiver;
  yrkestittel?: string;
  begrunnelse?: string;
  perioder: Periode[];
  handlingType: Kodeverk;
  kilde: Kodeverk;
  permisjoner?: {
    permisjonFom?: string;
    permisjonTom?: string;
    permisjonsprosent?: number;
    type?: Kodeverk;
  }[];
  stillingsprosent?: number;
  aksjonspunktÅrsaker: Kodeverk;
  inntektsmeldinger: Inntektsmelding[];
}>;

export default Arbeidsforhold;
