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
    /*$('#js-plant-id-value').click(function(e){
        e.preventDefault();
        let plantIdSearch = $('.js-plant-id-value').val();
        getPlantIdSearch(plantIdSearch);
    });*/

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

        watchPlantIdSearch();

        function watchPlantIdSearch() {
            $('.js-plant-id-submit').on('click', function (e) {
                e.preventDefault();
                const plantIdSearch = $('.js-plant-id-value').val();
                getPlantIdSearch(plantIdSearch);
            });
        }

        $('.spinner.one').fadeOut(10, function(){
            $('.spinner.one').remove();
        });
        getCage(cityNameSearch);
    }

//Ajax Call to Cage API
    function getCage(cityNameSearch, plantIdSearch) {
        let url =  "https://api.opencagedata.com/geocode/v1/json?key=98064fd649cd4b92a8725b3eb7ae2b19&q=" + cityNameSearch;
        $.getJSON(url, function(responseJson){
            displayResultsCage(cityNameSearch, responseJson);
        });
    }

//Display Cage API Data
    function displayResultsCage(cityNameSearch, responseJson) {
        console.log(responseJson);
        $('#js-error-message').remove();
        $('#results-list-two').empty();

        $('#results-list-two').append(`
    <input class="small button green fade hidden" type="submit" value="${responseJson.results[0].geometry.lat},${responseJson.results[0].geometry.lng}" id="js-coordinate-value">
    
    <li><h3 class="mobile">${responseJson.results[0].formatted} ${responseJson.results[0].geometry.lat},${responseJson.results[0].geometry.lng}</h3></li>
    `);
        let cityCoordinates = `${responseJson.results[0].geometry.lat},${responseJson.results[0].geometry.lng}`;
        getDarkSky(cityCoordinates);
    }

//Ajax Call to DarkSky Api
    function getDarkSky(cityCoordinates) {
        let url = 'https://api.darksky.net/forecast/c867e7ceabc170eb994ba3978add10c6/' + cityCoordinates;
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = url;
        let darkSkySearch = proxyUrl + targetUrl;
        $.getJSON(darkSkySearch, function(responseJson){
            displayResultsDarkSky(responseJson)
        })
    }

 //Display DarkSky API Data
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
    }

//Ajax Call to Trefle API ID Search
    function getPlantIdSearch(plantIdSearch) {
        let url = 'https://trefle.io/api/plants/' + plantIdSearch + '?token=eGxMYTdpWXQ1eUh2T1FDMy95RHZNQT09';
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = url;
        let trefleIdSearch = proxyUrl + targetUrl;
        $.getJSON(trefleIdSearch, function (responseJson) {
            displayResultsPlantId(responseJson)

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
        let wikiSearch = `${responseJson.scientific_name}`
        getWikipediaApi(wikiSearch);
    }

    let wikiParams = {
    origin: '*',
    action: 'query',
    format: 'json',
    prop: 'extracts|pageimages',
    indexpageids: 1,
    redirects: 1,
    exchars: 1200,
    // explaintext: 1,
    exsectionformat: 'plain',
    piprop: 'name|thumbnail|original',
    pithumbsize: 250
};
//Ajax Call to get Wikipedia API Data

function getWikipediaApi(wikiSearch) {
    wikiParams.titles = wikiSearch;
    let url = 'https://en.wikipedia.org/w/api.php';
        $.getJSON(url, wikiParams, function(responseJson) {
            displayResultsWiki(responseJson)
        })

}

//Display Wiki Search Data

function displayResultsWiki(responseJson) {
    console.log(responseJson);
    let pageId = responseJson.query.pageids[0];
    let searchword = responseJson.query.pages[pageId].title.toLowerCase();
    let pattern = new RegExp(searchword, 'i');
    if (responseJson.query.pages[pageId].extract) var info = responseJson.query.pages[pageId].extract.replace(pattern, '<b>' + searchword + '</b>').replace('<span id="References">References</span>', '<p></p>').replace(new RegExp('<p><br /></p>', 'g'), '').replace('External links', 'Click more below for links to:');
    let thumbnail = responseJson.query.pages[pageId].thumbnail;
    let original = responseJson.query.pages[pageId].original;
    let pageimage = responseJson.query.pages[pageId].pageimage;
    let html = "";

    $('.wiki').empty();
    //If thumbnail is unavailable
    if (thumbnail === undefined || thumbnail === null) {
        //Check if extract from is cut off
        if (info.length < 1000) {
            info = info.substring(0, info.length - 3)
            html += info;
            $('.wiki').append(html);

            //If it is cut, get rid off abbreviated ending
        } else {
            info = info.substring(0, info.length - 7)
            for (var i = 1; i < 6; i++) {
                if (info.charAt(info.length - i) === '<') {
                    info = info.substring(0, info.length - i)
                }
            }
            html += info + '...</p>';
            $('.wiki').append(html);
        }
        //If thumbnail is available
    } else {
        //Same as above, check if extract is cut off or not
        if (info.length < 1000) {
            info = info.substring(0, info.length - 3)
            html += '<a href="' + original.source + '" data-lity><div class="picWrap"><img class="wikipic" src="' +
                thumbnail.source + '"><p class="expand"><i class="fa fa-arrows-alt" aria-hidden="true"></i><span class="captions"> &nbsp;' + pageimage.replace(/_/g, ' ').substring(0, pageimage.length - 4) + '</span></div></a>' + info;
            $('.wiki').append(html);
        } else {
            info = info.substring(0, info.length - 7)
            for (var i = 1; i < 6; i++) {
                if (info.charAt(info.length - i) === '<') {
                    info = info.substring(0, info.length - i)
                }
            }
            html += '<a href="' + original.source + '" data-lity><div class="picWrap"><img class="wikipic" src="' +
                thumbnail.source + '"><p class="expand"><i class="fa fa-arrows-alt" aria-hidden="true"></i><span class="captions"> &nbsp;' + pageimage.replace(/_/g, ' ').substring(0, pageimage.length - 4) + '</span></div></a>' + info + '...</p>';
            $('.wiki').append(html);
        }
    }
    $('.wiki').append('<hr>');
    $('.wiki').append('<p class="ext_link"><a href="//en.wikipedia.org/wiki/' + responseJson.query.pages[pageId].title +
        '" data-lity><i class="fa fa-external-link-square" aria-hidden="true"></i> &nbsp;More on Wikipedia</a></p>');
}







