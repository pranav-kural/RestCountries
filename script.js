// Utilizing REST Countries API https://restcountries.com/
"use strict";
// import data needed to retrieve Alpha-3 code for a country
import countryCodesData from "./data/countries.json" assert { type: "json" };

// global variables
let countriesAlreadyInView = [];

// DOM elements
const countriesContainer = document.querySelector(".countries");
const addCountryInput = document.querySelector("#input__add__country");
const addCountryButton = document.querySelector(".btn__add__country");
const deleteAllCountryButton = document.querySelector(".btn__delete__all");

const addCountriesToDOM = (...countries) => {
  // validation
  if (!countries) return alert("Invalid country codes provided!");
  // rest countries api v3.1 url
  const REST_API_URL = "https://restcountries.com/v3.1/";
  // url to search by country codes
  const searchByCountryCodes = REST_API_URL + "alpha?codes=";
  // ISO ISO 3166-1 Alpha-3 country codes
  const countryCodes = countries.join(",");
  // receive data and update the DOM
  fetch(searchByCountryCodes + countryCodes)
    .then((response) => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then((responseData) => updateCountriesContainerHTML(responseData))
    .catch((err) => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥💥 "${err.message}". Try again!`);
    })
    .finally(() => (countriesContainer.style.opacity = 1));

  const updateCountriesContainerHTML = (countries) => {
    const countryCards = [];
    for (const country of countries) {
      countryCards.push(`
        <article class="country">
              <img class="country__img" src="${country?.flags.svg}" />
              <div class="country__data">
                <h3 class="country__name">${
                  country?.name instanceof String
                    ? country?.name
                    : country?.name?.common
                }</h3>
                <h4 class="country__region">${country?.region}</h4>
                <p class="country__row"><span>👫</span>${(
                  +country?.population / 1000000
                ).toFixed(1)} million</p>
                <p class="country__row"><span>🗣️</span>${
                  country?.languages
                    ? Object.values(country?.languages)?.join(", ")
                    : ""
                }</p>
                <p class="country__row"><span>💰</span>${
                  country?.currencies
                    ? Object.values(country?.currencies)[0]?.name
                    : ""
                }</p>
              </div>
            </article>
      `);
    }
    countriesContainer.insertAdjacentHTML("beforeend", countryCards.join(""));
  };
};

const renderError = (message) =>
  countriesContainer.insertAdjacentText("beforeend", message);

const capitalize = (words) =>
  words
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const getCountryAlpha3Code = (countryName) => {
  const capitalizedCountryName = capitalize(countryName);
  const exactMatch = countryCodesData.find(
    (el) => el.name === capitalizedCountryName
  );
  if (exactMatch) return [exactMatch?.["alpha-3"]];
  const nearMatches = countryCodesData.filter((el) =>
    el.name.includes(capitalizedCountryName)
  );
  return nearMatches.map((nearMatch) => nearMatch?.["alpha-3"]);
};

const addCountryToDOM = () => {
  // validate user input
  if (!addCountryInput.value) return alert("Enter country name!");
  // get user input
  const userInput = addCountryInput.value?.trim();
  // search for a matching country
  const countryAlpha3Codes = getCountryAlpha3Code(userInput);
  // if country not found
  if (countryAlpha3Codes.length === 0)
    return alert(`Country "${userInput}" not found!`);
  // remove countries already in view
  const filteredCountryCodes = countryAlpha3Codes.filter(
    (country) => !countriesAlreadyInView.includes(country)
  );
  // if no countries to add, return
  if (filteredCountryCodes.length === 0)
    return alert("Country already in view");
  // add countries to DOM
  addCountriesToDOM(...filteredCountryCodes);
  // update countries in view
  filteredCountryCodes.forEach((countryCode) =>
    countriesAlreadyInView.push(countryCode)
  );
};

addCountryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addCountryToDOM();
    addCountryInput.value = "";
  }
});

addCountryButton.addEventListener("click", () => {
  addCountryToDOM();
  addCountryInput.value = "";
});

deleteAllCountryButton.addEventListener("click", () => {
  countriesContainer.replaceChildren();
  countriesAlreadyInView = [];
});

// supply list of country codes
// addCountriesToDOM("IND", "ECU", "PRT", "CHN", "PAK");

/* 
// Uncomment to unable the logic to get user's current location (coordinates)
// reverse geocode to get the country's name, and add country card to DOM

if (navigator?.geolocation) {
  // get user location
  navigator.geolocation.getCurrentPosition(addCurrentCountry, (err) =>
    renderError(err)
  );
}

reverse geocoding the coordinates
function getReverseGeocodedLocation(coords) {
  const URL = `https://geocode.xyz/${coords.latitude},${coords.longitude}?geoit=json`;
  // get country name
  fetch(URL)
    .then((response) => {
      if (!response.ok)
        throw new Error(`Unable to do reverse geocoding (${response.status})`);

      if (response.status === "403")
        throw new Error(
          `Too many requests within a second. Please wait and try later (${response.status})`
        );

      return response.json();
    })
    .then((data) => addCountriesToDOM(data.country.slice(0, 3).toUpperCase()));
}

function addCurrentCountry(userCoords) {
  // validation
  if (!userCoords) return alert("Invalid user location!");

  const { latitude } = userCoords.coords;
  const { longitude } = userCoords.coords;

  getReverseGeocodedLocation({ latitude: latitude, longitude: longitude });
}

*/
