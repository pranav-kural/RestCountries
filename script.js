// Utilizing REST Countries API https://restcountries.com/
"use strict";
// import data needed to retrieve Alpha-3 code for a country
import countryCodesData from "./data/countries.json" assert { type: "json" };

// DOM elements
const countriesContainer = document.querySelector(".countries");

if (navigator?.geolocation) {
  // get user location
  navigator.geolocation.getCurrentPosition(addCurrentCountry, (err) =>
    renderError(err)
  );
}

const getCountryAlpha3Code = (country) =>
  countryCodesData.find((el) => el.name === "Angola")["alpha-3"];

const renderError = (message) =>
  countriesContainer.insertAdjacentText("beforeend", message);

function addCurrentCountry(userCoords) {
  // validation
  if (!userCoords) return alert("Invalid user location!");

  const { latitude } = userCoords.coords;
  const { longitude } = userCoords.coords;

  getReverseGeocodedLocation({ latitude: latitude, longitude: longitude });
}

// reverse geocoding the coordinates
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

const addCountriesToDOM = (...countries) => {
  // validation
  if (!countries) return alert("Invalid country codes provided!");

  const renderError = (message) =>
    countriesContainer.insertAdjacentText("beforeend", message);

  // get country data
  const fetchCountryData = (countries) => {
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
  };

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
              <p class="country__row"><span>🗣️</span>${Object.values(
                country.languages
              ).join(", ")}</p>
              <p class="country__row"><span>💰</span>${
                Object.values(country?.currencies)[0]?.name
              }</p>
            </div>
          </article>
    `);
    }
    countriesContainer.insertAdjacentHTML("beforeend", countryCards.join(""));
  };

  fetchCountryData(countries);
};

// supply list of country codes
addCountriesToDOM("IND", "ECU", "PRT", "CHN", "PAK");
