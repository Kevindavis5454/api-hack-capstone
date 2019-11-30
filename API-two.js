'use strict';

//DarkSky

const searchURLTWO = 'https://api.darksky.net/forecast/c867e7ceabc170eb994ba3978add10c6/';

function getDarkSky(searchCoordOne) {

    const urlDarkSky = searchURLTWO + searchCoordOne;

    console.log(urlDarkSky);

    const proxyUrlDarkSky = 'https://cors-anywhere.herokuapp.com/',
        targetUrlDarkSky = urlDarkSky;

    fetch(proxyUrlDarkSky + targetUrlDarkSky)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResultsDarkSky(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayResultsDarkSky(responseJson) {
    console.log(responseJson);

    $('#results-dark-sky').append(`
    <li>Current Weather: <br>
        Temperature: ${responseJson.currently.temperature}<br>
        Precipitation Chance: ${responseJson.currently.precipProbability}<br>
        Time: ${responseJson.currently.time}<br>
        Wind Speed: ${responseJson.currently.windSpeed}<br>
        Dew Point: ${responseJson.currently.dewPoint}<br>
        Cloud Cover: ${responseJson.currently.cloudCover}<br>
        </li>
    <li>Daily Weather:<br>
        Summary: ${responseJson.daily.summary}<br>
    </li>
    <li>Next 8 Day Forecast</li>   
    `)

    for (let i=0 ; i < responseJson.daily.data.length ; i++) {

        $('#results-dark-sky').append(`
        
        <li>Summary: ${responseJson.daily.data[i].summary}<br>
            Temp. Hi: ${responseJson.daily.data[i].temperatureHigh}<br>
            Temp. Low: ${responseJson.daily.data[i].temperatureLow}<br>
            Wind Speed: ${responseJson.daily.data[i].windSpeed} <br>
            Precipitation Chance: ${responseJson.daily.data[i].precipProbability}<br>
            Cloud Cover: ${responseJson.daily.data[i].cloudCover}<br>
            Dew Point: ${responseJson.daily.data[i].dewPoint}
            </li>
        `)
    }
        
        

};


