'use strict';

//DarkSky
function timeConverter(unixTimestamp) {
    let a = new Date(unixTimestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    let sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}
console.log(timeConverter(0));

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

    $('#results-list-two').append(`
    <li><h3>Current Weather: </h3><br>
        Temperature: ${responseJson.currently.temperature}&#8457;<br>
        Precipitation Chance: ${responseJson.currently.precipProbability}<br>
        Time: ${timeConverter(`${responseJson.currently.time}`)}<br>
        Wind Speed: ${responseJson.currently.windSpeed}MPH<br>
        Dew Point: ${responseJson.currently.dewPoint}&#8457;<br>
        UV Index: ${responseJson.currently.uvIndex}
        </li>
        <li><h3>Next 8 Day Forecast</h3><br>
        Summary: ${responseJson.daily.summary}<br>
        </li>
    `)

    for (let i=0 ; i < responseJson.daily.data.length ; i++) {

        $('#results-list-two').append(`
        
        <li><h3>${timeConverter(`${responseJson.daily.data[i].time}`)}</h3><br>
            Summary: ${responseJson.daily.data[i].summary}<br>
            Temp. Hi: ${responseJson.daily.data[i].temperatureHigh}&#8457; <br>
            Temp. Low: ${responseJson.daily.data[i].temperatureLow}&#8457;<br>
            Wind Speed: ${responseJson.daily.data[i].windSpeed}MPH <br>
            Precipitation Chance: ${responseJson.daily.data[i].precipProbability}%<br>
            Precipitation Type: ${responseJson.daily.data[i].precipType}<br>
            Dew Point: ${responseJson.daily.data[i].dewPoint}&#8457;<br>
            Sunrise Time: ${timeConverter(`${responseJson.daily.data[i].sunriseTime}`)}<br>
            Sunset Time: ${timeConverter(`${responseJson.daily.data[i].sunsetTime}`)}<br>
            UV Index: ${responseJson.daily.data[i].uvIndex} Highest Index Time: ${timeConverter(`${responseJson.daily.data[i].uvIndexTime}`)}
            </li>
        `)
    }
    $('.spinner.three').fadeOut(10, function(){
        $('.spinner.three').remove();
    });
}


