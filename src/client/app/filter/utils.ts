export function feltverdiKey(item) {
  return item.område + "__" + item.kode;
}

export const visningsnavnForFelt = (felter: Oppgavefelt[], område: String, kode: String) => {
  for (const felt of felter) {
    if (felt.område == område && felt.kode == kode) {
      return felt.visningsnavn;
    }
  }
  console.log("Mangler visningsnavn for: " + område + "." + kode);
  return kode;
};

export function områdeFraKey(key) {
  return key.split("__")[0];
}

export function kodeFraKey(key) {
  return key.split("__")[1];
}
