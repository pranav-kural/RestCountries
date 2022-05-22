"use strict";

// Utilizing REST Countries API https://restcountries.com/

// DOM elements
const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

// global variables
// rest countries api v3.1 url
const REST_API_URL = "https://restcountries.com/v3.1/";
// url to search by country codes
const searchByCountryCodes = REST_API_URL + "alpha?codes=";
// ISO ISO 3166-1 Alpha-3 country codes
const countries = "IND,ECU,CAN,PRT";
const request = new XMLHttpRequest();

// making the request
request.open("GET", `${searchByCountryCodes}${countries}`);
request.send();

// receiving the data
request.addEventListener("load", function () {
  const data = JSON.parse(this.responseText);
  console.dir(data);
});
