'use strict';

//Trefle
//Global Variables for use within all functions
const searchURLOne = 'https://trefle.io/api/plants';

const searchURLId = 'https://trefle.io/api/plants/';

const apiKeyOne = "eGxMYTdpWXQ1eUh2T1FDMy95RHZNQT09";



//function to encode the parameters we want to include in the query line to be in the proper URL format
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//Function to query the Json Data from Trefle off a common or scientific plant name search
function getTrefle(query) {

    const params = {
        token : apiKeyOne,
        q: query,
    };

    const queryString = formatQueryParams(params);

    const url = searchURLOne + '?' + queryString;

    console.log(url);

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = url;

    fetch(proxyUrl + targetUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}
// Function to display the results from the common or scientific plant name search
function displayResults(responseJson) {
    console.log(responseJson);

    $('#results-list-one').empty();

    for (let i = 0; i < responseJson.length; i++) {

        if (responseJson[i].common_name === null) {
            $('#results-list-one').append(`
        <li><h3>Common Name data not found</h3>
        <p>${responseJson[i].scientific_name}</p>
        <form class="js-plant-id-submit"><Label>Plant Id</Label>
        <input type="submit" value="${responseJson[i].id}" class="js-plant-id-value"></form>
        </li>
        `)
        } else {
            $('#results-list-one').append(`
        <li><h3>${responseJson[i].common_name}</h3>
        <p>${responseJson[i].scientific_name}</p>
        <form class="js-plant-id-submit"><Label>Plant Id</Label>
        <input type="submit" value="${responseJson[i].id}" class="js-plant-id-value"><--Click me!</form>
        </li>
        `)
        }

    } ;
    watchPlantIdSearch();

    function watchPlantIdSearch() {
        $('.js-plant-id-submit').on('click', function() {
            event.preventDefault();
            const searchIdOne = $('.js-plant-id-value').val();
            getPlantIdSearch(searchIdOne);
        });
    }
    $('#results-one').removeClass('hidden');

}




//Function to format the query Parameters for the Plant ID API query
function formatQueryParamsIdSearch(paramsIdSearch) {
    const queryItems = Object.keys(paramsIdSearch)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsIdSearch[key])}`)
    return queryItems.join('&');
}



//function to query the Trefle API off the plant ID and return Json Data
function getPlantIdSearch(queryId) {

    const paramsIdSearch = {
        token : apiKeyOne,
    };

    const queryStringIdSearch = formatQueryParamsIdSearch(paramsIdSearch);

    const urlIdSearch = searchURLId + queryId + '?' + queryStringIdSearch;

    console.log(urlIdSearch);

    const proxyUrlIdSearch = 'https://cors-anywhere.herokuapp.com/',
        targetUrlIdSearch = urlIdSearch;

    fetch(proxyUrlIdSearch + targetUrlIdSearch)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResultsPlantId(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

}


// Function to display the Results from the Plant ID Search of the Trefle API
function displayResultsPlantId (responseJson) {
    console.log(responseJson);
    $('#results-list-one').empty();


    if (responseJson.common_name !== null) {
        $('#results-list-one').append(`
        <li><h3>Common Name: ${responseJson.common_name}</h3></li>
        `);
    }

    $('#results-list-one').append(`
        <li>Plant ID: ${responseJson.id}</li>
    `)

    if (responseJson.scientific_name !== null) {
        $('#results-list-one').append(`
        <li><h4>Scientific Name: ${responseJson.scientific_name}</h4></li>
        `);
    }

    if (responseJson.division === null || responseJson.class === null || responseJson.order === null || responseJson.family === null || responseJson.genus === null ) {
        $('#results-list-one').append(`
        <li> Division/Class/Order/Family/Genus Data not found</li>
        `)
    }
        else {
        $('#results-list-one').append(`
        <li>Division: ${responseJson.division.name} Class: ${responseJson.class.name}  Order: ${responseJson.order.name} Family: ${responseJson.family.name} Genus: ${responseJson.genus.name}</li>
    `)
    }
    if (responseJson.duration === null){
        $('#results-list-one').append(`
        <li>Plant Duration Data not found</li>
        `)
    } else {
        $('#results-list-one').append(`
        <li>Plant Duration: ${responseJson.duration}</li>
    `)
    }

    if (responseJson.images !== null) {
        for (let i = 0; i < responseJson.images.length; i++) {
        $('#results-list-one').append(`
        <li><img id="plant-picture" src="${responseJson.images[i].url}" alt="Flower Picture"></li>
        `);
        }
    }
    if (responseJson.main_species.growth.temperature_minimum.deg_f === null) {
        $('#results-list-one').append(`
            <li>Growth temperature minimum data not found</li>
        `);
    }else {
        $('#results-list-one').append(`
            <li>Growth Temperature Minimum: ${responseJson.main_species.growth.temperature_minimum.deg_f}</li>
        `)
    }
}


//Function to initially get Trefle Api Information from a common/scientific name search
function watchPlantSearch() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const searchTermOne = $('#js-search-term-one').val();
        getTrefle(searchTermOne);
    });
}


//Function to Start Jquery on the Page
$(function() {
    console.log('App loaded! Waiting for submit');
    watchPlantSearch();
});