'use strict';

//Trefle

const searchURLOne = 'https://trefle.io/api/plants';

const searchURLId = 'https://trefle.io/api/plants/';

const apiKeyOne = "eGxMYTdpWXQ1eUh2T1FDMy95RHZNQT09";

const linkKey = '?token=eGxMYTdpWXQ1eUh2T1FDMy95RHZNQT09';



function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


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

function displayResults(responseJson) {
    console.log(responseJson);

    $('#results-list-one').empty();

    for (let i = 0; i < responseJson.length; i++){

        $('#results-list-one').append(`
        <li><h3>${responseJson[i].common_name}</h3>
        <p>${responseJson[i].scientific_name}</p>
        <p>Plant Id: ${responseJson[i].id}</p>
        </li>
            
        `)};
    $('#results-one').removeClass('hidden');
};



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

    $('#results-list-one').append(`
        <li><h3>Common Name: ${responseJson.common_name}</h3>
            <h4>Scientific Name: ${responseJson.scientific_name}</h4>
            <img src="${responseJson.images[0].url}" alt="Flower Picture">
            <img src="${responseJson.images[1].url}" alt="Flower Picture">
       </li>
       <li><h3>Growing Information</h3>
       <p>Temperature Minimum:</p>
       </li>
        
            
        `);

}



//Function for the user to get specific plant information from the Trefle API using the plant ID
function watchPlantIdSearch() {
    $('#js-form-id-search').submit(event => {
        event.preventDefault();
        const searchIdOne = $('#js-plant-id').val();
        getPlantIdSearch(searchIdOne);
    });
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
    watchPlantIdSearch();
});