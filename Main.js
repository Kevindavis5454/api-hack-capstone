//Convert Time to readable
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

    $('#js-submit-both-button').click(function(e){
        e.preventDefault();
       let plantNameSearch = $('#js-search-term-one').val();
       let cityNameSearch = $('#js-search-term-two').val();
       getTrefle(plantNameSearch, cityNameSearch)
    });

//Ajax call to Trefle Api for Common/Scientific Name Search
    function getTrefle(plantNameSearch, cityNameSearch) {
        let url = 'https://trefle.io/api/plants?token=eGxMYTdpWXQ1eUh2T1FDMy95RHZNQT09&&q=' + plantNameSearch;
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = url;
        let trefleMainSearch = proxyUrl + targetUrl;

        $.getJSON(trefleMainSearch, function(responseJson){
            displayResultsTrefle(cityNameSearch, responseJson);
        });
    }

//Display Trefle Data for Common/Scientific Name Search
    function displayResultsTrefle(cityNameSearch, responseJson) {

        console.log(responseJson);
        $('#js-error-message').remove();
        $('#results-list-one').empty();

        for (let i = 0; i < responseJson.length; i++) {

            if (responseJson[i].common_name === null) {
                $('#results-list-one').append(`
        <li><h3>Common Name data not found</h3>
        <p>${responseJson[i].scientific_name}</p>
        <form class="js-plant-id-submit"><Label>Plant Id</Label>
        <input type="submit" value="${responseJson[i].id}" class="js-plant-id-value small button green fade"></form>
        </li>
        `)
            } else {
                $('#results-list-one').append(`
        <li><h3>${responseJson[i].common_name}</h3>
        <p>${responseJson[i].scientific_name}</p>
        <form class="js-plant-id-submit"><Label>Plant Id</Label>
        <input type="submit" value="${responseJson[i].id}" class="js-plant-id-value small button green fade"></form>
        </li>
        `)
            }
        } ;
        let plantIdSearch = $('.js-plant-id-value').val();

        $('.spinner.one').fadeOut(10, function(){
            $('.spinner.one').remove();
        });
        getCage(cityNameSearch, plantIdSearch);
    }

//Ajax Call to Cage API
    function getCage(cityNameSearch, plantIdSearch) {
        let url =  "https://api.opencagedata.com/geocode/v1/json?key=98064fd649cd4b92a8725b3eb7ae2b19&q=" + cityNameSearch;
        $.getJSON(url, function(responseJson){
            displayResultsCage(cityNameSearch, responseJson, plantIdSearch);
        });
    }

//Display Cage API Data
    function displayResultsCage(cityNameSearch, responseJson, plantIdSearch) {
        console.log(responseJson);
        $('#js-error-message').remove();
        $('#results-list-two').empty();

        $('#results-list-two').append(`
    <input class="small button green fade" type="submit" value="${responseJson.results[0].geometry.lat},${responseJson.results[0].geometry.lng}" id="js-coordinate-value">
    
    <li><h3 class="mobile">${responseJson.results[0].formatted} ${responseJson.results[0].geometry.lat},${responseJson.results[0].geometry.lng}</h3></li>
    `);
        let cityCoordinates = `${responseJson.results[0].geometry.lat},${responseJson.results[0].geometry.lng}`;
        getDarkSky(cityCoordinates, plantIdSearch);
    }

//Ajax Call to DarkSky Api
    function getDarkSky(cityCoordinates, plantIdSearch) {
        let url = 'https://api.darksky.net/forecast/c867e7ceabc170eb994ba3978add10c6/' + cityCoordinates;
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = url;
        let darkSkySearch = proxyUrl + targetUrl;
        $.getJSON(darkSkySearch, function(responseJson){
            displayResultsDarkSky(responseJson, plantIdSearch)
        })
    }

 //Display DarkSky API Data
    function displayResultsDarkSky(responseJson, plantIdSearch) {
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
        getPlantIdSearch(plantIdSearch);
    }

//Ajax Call to Trefle API ID Search
    function getPlantIdSearch(plantIdSearch) {
        $('#js-plant-id-value').submit(event => {
            event.preventDefault();

        let url = 'https://trefle.io/api/plants/' + plantIdSearch + '?token=eGxMYTdpWXQ1eUh2T1FDMy95RHZNQT09';
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = url;
        const trefleIdSearch = proxyUrl + targetUrl;
        $.getJSON(trefleIdSearch, function(responseJson){
            displayResultsPlantId(responseJson)
        })
    })
    }

//Display Trefle ID Search Data
    function displayResultsPlantId(responseJson) {
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








