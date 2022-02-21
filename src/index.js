import './css/styles.css';
import { debounce } from 'debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/functions/fetchCountries';
import countryList from './js/templates/countryList.hbs';
import coutryDetailed from './js/templates/countryDetailed.hbs';

const DEBOUNCE_DELAY = 300;

let countryToFind = '';

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

function onCountryInput(e) {
  countryToFind = e.target.value.trim();
  clearResult();

  fetchCountries(countryToFind)
    .then(data => {
      let amount = data.length;

      if (amount > 10) {
        return Notify.info(`😔 Too many matches found. Please enter a more specific name`);
      } else if (amount >= 2 && amount <= 10) {
        renderResultList(data);
      } else if (amount === 1) {
        renderResult(data);
      }
    })
    .catch(onFetchError);
}

function onFetchError(error) {
  if (countryToFind !== '') {
    Notify.failure(`😱 Oops, there is no country with that name`);
  }
}

function clearResult() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function renderResult(data) {
  countryInfoEl.insertAdjacentHTML('beforeend', coutryDetailed(data));
}

function renderResultList(data) {
  countryListEl.insertAdjacentHTML('beforeend', countryList(data));
}

inputEl.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));
