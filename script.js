"use strict";

// Utilizing REST Countries API https://restcountries.com/

// DOM elements
const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

// global variables
const getCountryData = (...countries) => {
  // validation
  if (!countries) return alert("Invalid country codes provided!");

  // rest countries api v3.1 url
  const REST_API_URL = "https://restcountries.com/v3.1/";
  // url to search by country codes
  const searchByCountryCodes = REST_API_URL + "alpha?codes=";
  // ISO ISO 3166-1 Alpha-3 country codes
  const countryCodes = countries.join(",");
  const request = new XMLHttpRequest();

  // making the request
  request.open("GET", `${searchByCountryCodes}${countryCodes}`);
  request.send();

  // receiving the data
  request.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    updateCountriesContainerHTML(data);
  });

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
    countriesContainer.style.opacity = 1;
  };
};

// supply list of country codes
getCountryData("IND", "ECU", "CAN", "PRT");
getCountryData("CHN", "PAK");
