import { School } from "@/lib/types/index";

// Get a list of countries sorted by the user's local language
const getCountryList = (locale = window.navigator.language) => {
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });

  //TODO: add more countries
  const codes = ["CA"];

  return codes
    .map((code) => ({
      code: code,
      name: regionNames.of(code),
    }))
    .sort((a, b) => a.name!.localeCompare(b.name!)); // Alphabetical sort
};

export const countries = getCountryList("en")

export const universities: Omit<School, "id">[] = [
  {
    name: "Algoma University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Sault Ste. Marie",
  },
  {
    name: "Brock University",
    countryCode: "CA",
    regionCode: "ON",
    city: "St. Catharines",
  },
  {
    name: "Carleton University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Ottawa",
  },
  {
    name: "Lakehead University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Thunder Bay",
  },
  {
    name: "Laurentian University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Sudbury",
  },
  {
    name: "McMaster University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Hamilton",
  },
  {
    name: "Nipissing University",
    countryCode: "CA",
    regionCode: "ON",
    city: "North Bay",
  },
  {
    name: "Ontario College of Art and Design University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
  {
    name: "Queen's University at Kingston",
    countryCode: "CA",
    regionCode: "ON",
    city: "Kingston",
  },
  {
    name: "Royal Military College of Canada",
    countryCode: "CA",
    regionCode: "ON",
    city: "Kingston",
  },
  {
    name: "Toronto Metropolitan University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
  {
    name: "Trent University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Peterborough",
  },
  {
    name: "Université de Hearst",
    countryCode: "CA",
    regionCode: "ON",
    city: "Hearst",
  },
  {
    name: "Université de l'Ontario français",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
  {
    name: "Université de Sudbury",
    countryCode: "CA",
    regionCode: "ON",
    city: "Sudbury",
  },
  {
    name: "University of Guelph",
    countryCode: "CA",
    regionCode: "ON",
    city: "Guelph",
  },
  {
    name: "Ontario Tech University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Oshawa",
  },
  {
    name: "University of Ottawa",
    countryCode: "CA",
    regionCode: "ON",
    city: "Ottawa",
  },
  {
    name: "University of Toronto",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
  {
    name: "University of Waterloo",
    countryCode: "CA",
    regionCode: "ON",
    city: "Waterloo",
  },
  {
    name: "University of Western Ontario",
    countryCode: "CA",
    regionCode: "ON",
    city: "London",
  },
  {
    name: "University of Windsor",
    countryCode: "CA",
    regionCode: "ON",
    city: "Windsor",
  },
  {
    name: "Wilfrid Laurier University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Waterloo",
  },
  {
    name: "York University",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
];

export const colleges: Omit<School, "id">[] = [
  {
    name: "Algonquin College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Ottawa",
  },
  { name: "Boréal", countryCode: "CA", regionCode: "ON", city: "Sudbury" },
  {
    name: "Cambrian College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Sudbury",
  },
  {
    name: "Canadore College",
    countryCode: "CA",
    regionCode: "ON",
    city: "North Bay",
  },
  {
    name: "Centennial College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
  {
    name: "Conestoga College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Kitchener",
  },
  {
    name: "Confederation College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Thunder Bay",
  },
  {
    name: "Durham College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Oshawa",
  },
  {
    name: "Fanshawe College",
    countryCode: "CA",
    regionCode: "ON",
    city: "London",
  },
  {
    name: "Fleming College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Peterborough",
  },
  {
    name: "George Brown College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
  {
    name: "Georgian College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Barrie",
  },
  {
    name: "Humber College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
  {
    name: "La Cité Collégiale",
    countryCode: "CA",
    regionCode: "ON",
    city: "Ottawa",
  },
  {
    name: "Lambton College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Sarnia",
  },
  {
    name: "Loyalist College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Belleville",
  },
  {
    name: "Michener Institute",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
  {
    name: "Mohawk College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Hamilton",
  },
  {
    name: "Niagara College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Welland",
  },
  {
    name: "Niagara Parks School of Horticulture",
    countryCode: "CA",
    regionCode: "ON",
    city: "Niagara Falls",
  },
  {
    name: "Northern College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Timmins",
  },
  {
    name: "Ridgetown Campus",
    countryCode: "CA",
    regionCode: "ON",
    city: "Ridgetown",
  },
  {
    name: "Sault College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Sault Ste. Marie",
  },
  {
    name: "Seneca Polytechnic",
    countryCode: "CA",
    regionCode: "ON",
    city: "Toronto",
  },
  {
    name: "Sheridan College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Oakville",
  },
  {
    name: "St. Clair College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Windsor",
  },
  {
    name: "St. Lawrence College",
    countryCode: "CA",
    regionCode: "ON",
    city: "Kingston",
  },
];

export const schools: Omit<School, "id">[] = [...universities, ...colleges];
