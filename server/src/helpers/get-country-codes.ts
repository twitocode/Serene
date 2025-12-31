// Get a list of countries sorted by the user's local language
export const SUPPORTED_COUNTRY_CODES = ["CA"] as const

export const getCountryList = (locale = window.navigator.language) => {
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });

  //TODO: add more countries

  return SUPPORTED_COUNTRY_CODES
    .map((code) => ({
      code: code,
      name: regionNames.of(code),
    }))
    .sort((a, b) => a.name!.localeCompare(b.name!)); // Alphabetical sort
};

