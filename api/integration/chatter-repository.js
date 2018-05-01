const logger = require('../util/logger');

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed
var rp = require('request-promise');

const getNews = (filterString) => {
    logger.abcde(`will call based on value of filterString (${filterString})`, __function, __line, __file);
    filterString = encodeURIComponent(filterString);
    // const urlString = `https://news.google.com/news/rss/search/section/q/${filterString}/${filterString}?hl=en&gl=US&ned=us`;

    // https://www.economist.com/feeds/print-sections/77/business.xml
    // https://www.economist.com/sections/business-finance/rss.xml

        const urlString = `https://news.google.com/news/rss/search/section/q/${filterString}/${filterString}?hl=en&gl=US&ned=us`;


    return getFeed(urlString);
};

const getTwitter = (filterString) => {
    logger.abcde(`will call based on value of filterString (${filterString})`, __function, __line, __file);
    filterString = encodeURIComponent(filterString);
    // const urlString = `https://queryfeed.net/twitter?q=${filterString}&title-type=user-name-both&geocode=`;
    const urlString = `https://queryfeed.net/tw?q=${filterString}`;

    return getFeed(urlString);
};

const getWeather = (filterString) => {
    logger.abcde(`=================>>>>> Weather filterString::: (${filterString})`, __function, __line, __file);
    return Promise.all(filterString.map( address => {
        return geocodeAddress(address)
             .then(result => {
                 const body = JSON.parse(result.body);
                 const value = body.results[0];
                let coords = {
                    address: value.formatted_address,
                    lat: value.geometry.location.lat,
                    lng: value.geometry.location.lng
                };
                console.log('=====> coords ' + JSON.stringify(coords));
                return getWeatherDetails(coords.lat,coords.lng)
                     .then(result => {
                        return {
                            coords: coords,
                            forecast: JSON.parse(result.body)
                        };
                     })
                     .catch(err => {
                        return err;
                     });
             })
             .catch((err) =>  {
                 console.log('BBAD====> ' + err);
                 return ('something errored out');
             })
    }))
    .then( values => {
        return( values );
    });
};


getWeatherDetails = (lat, lng) => {
    console.log('lat:: ' + lat);
    console.log('lng:: ' + lng);
    let url =  `https://api.darksky.net/forecast/3cd9a3bc9989268fd1c87f9b188f4aae/${lat},${lng}`;
    logger.abcde(`=================>>>>> READ FOR WEATHER DETAILS::: (${url})`, __function, __line, __file);
    const options = {
        method: 'GET',
        uri: url,
        resolveWithFullResponse: true
    };
    return rp(options);
}



const getFeed = (urlString) => {

    return new Promise( (resolve, reject) => {
        console.log( 'url string ' + urlString);
            var req = request(urlString);
            const options = {
                addmeta: false
            };
            var feedparser = new FeedParser([options]);
            req.on('error', function (error) {
                // handle any request errors
            });
            req.on('response', function (res) {
                var stream = this; // `this` is `req`, which is a stream

                if (res.statusCode !== 200) {
                    this.emit('error', new Error('Bad status code'));
                }
                else {
                    stream.pipe(feedparser);
                }
            });
            feedparser.on('error', function (error) {
                // always handle errors
            });
            let body = [];
            feedparser.on('readable', function () {
                var stream = this; // `this` is `feedparser`, which is a stream
                var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
                var item = [];
                while (item = stream.read()) {
                    // console.log( '-------> ' + (Object.getOwnPropertyNames(item)) );
                    body.push(item);
                }
            });
            feedparser.on('end', (result) => {
                var whatever = this; // `this` is `feedparser`, which is a stream
                // console.log('in the end ' + body);
                resolve(body);
            });

    });
};

geocodeAddress = (address) => {
    const encodedAddress = encodeURIComponent(address);
    console.log(`Encoded address ${encodedAddress}`);
    url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyBNqmVYmYOhDmBzjkr4uk7HdRSS8RXgw1k`
    const options = {
        method: 'GET',
        uri: url,
        resolveWithFullResponse: true
    };
    return rp(options);
};

module.exports = {
    getNews,
    getTwitter,
    getWeather
};
