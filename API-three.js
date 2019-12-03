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
    $('#js-error-message').remove();
    $('#results-list-two').empty();

    $('#results-list-two').append(`
    <form id="js-coordinate-submit-form"><label>Latitude/Longitude:</label><br>
    <input class="small button green" type="submit" value="${responseJson.results[0].geometry.lat},${responseJson.results[0].geometry.lng}" id="js-coordinate-value"><--Click me!
    </form> 
    <li><h3 class="mobile">${responseJson.results[0].formatted}</h3></li>
    `);

    $('.spinner.two').fadeOut(10, function(){
        $('.spinner.two').remove();
    });

    watchDarkSky();

    function watchDarkSky() {

        $('#js-coordinate-submit-form').submit(event => {

            event.preventDefault();
            const searchCoordOne = $('#js-coordinate-value').val();
            getDarkSky(searchCoordOne);
            $('.spinner.three').removeClass('hidden');
        });
    }

    $('#results-two').removeClass('hidden');
}

function watchCage() {
    $('#js-form-cage').submit(event => {
        event.preventDefault();
        const searchTermTwo = $('#js-search-term-two').val();
        getCage(searchTermTwo);
        $('.spinner.two').removeClass('hidden');
    });
}

$(function() {
    console.log('App loaded! Waiting for submit');
    watchCage();
});