'use strict';

//Open Cage Geocoding

const apiKeyThree = "98064fd649cd4b92a8725b3eb7ae2b19";

const searchUrlThree =  "https://api.opencagedata.com/geocode/v1/json";

function formatCageQueryParams(paramsCage) {
    const queryItems = Object.keys(paramsCage)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsCage[key])}`)
    return queryItems.join('&');
}

function getCage(queryCage) {

    const paramsCage = {
        key : apiKeyThree,
        q: queryCage,
    };

    const queryStringCage = formatCageQueryParams(paramsCage);

    const urlCage = searchUrlThree + '?' + queryStringCage;

    console.log(urlCage);

    const proxyUrlCage = 'https://cors-anywhere.herokuapp.com/',
        targetUrlCage = urlCage;

    fetch(proxyUrlCage + targetUrlCage)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResultsCage(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayResultsCage(responseJson) {
    console.log(responseJson);

    $('#results-list-two').empty();

    $('#results-list-two').append(`
    <li>Latitude= ${responseJson.results[0].geometry.lat} Longitude= ${responseJson.results[0].geometry.lng}</li>
    <li>City Name: ${responseJson.results[0].formatted}</li>
    `)

    $('#results-two').removeClass('hidden');
};

function watchCage() {
    $('#js-form-cage').submit(event => {
        event.preventDefault();
        const searchTermTwo = $('#js-search-term-two').val();
        getCage(searchTermTwo);
    });
}

$(function() {
    console.log('App loaded! Waiting for submit');
    watchCage();
});