const parseUrl = require('parseurl');
const {URLSearchParams} = require('url');

const chatterService = require('../service/chatter-service');
const Constants = require('../util/constants');
const logger = require('../util/logger');

const getNews = (req, res) => {
    logger.abcde('getting news with filter', __function, __line, __file);
    const params = new URLSearchParams(parseUrl(req).query);
    const filterString = params.get('filter');
        chatterService.getNews(filterString)
            .then((result) => wrapResponse(res, result, Constants.HTTP_200));
};

const getTwitter = (req, res) => {
    logger.abcde('getting twitter with filter', __function, __line, __file);
    const params = new URLSearchParams(parseUrl(req).query);
    const filterString = params.get('filter');
    chatterService.getTwitter(filterString)
        .then((result) => wrapResponse(res, result, Constants.HTTP_200));
};

const getWeather = (req, res) => {
    logger.abcde('getting weather with filter', __function, __line, __file);
    const params = new URLSearchParams(parseUrl(req).query);
    const filterString = params.getAll('filter');
    logger.abcde('xxxxxxxxxxxxxxxxxxxx getting weather with filter' + filterString, __function, __line, __file);
    chatterService.getWeather(filterString)
        .then((result) => wrapResponse(res, result, Constants.HTTP_200));
};

/* private */
const wrapResponse = (res, result, status) => {
//    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(result));
    return res;
};

/* private */
const wrapError = (res, err) => {
    console.error(err);
    let errorCode = err.code;
    if (!filesValidator.isValidErrorCode(errorCode)) {
        errorCode = Constants.HTTP_400;
    }
    res.writeHead(errorCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(err));
    return res;
};

module.exports = {
    getNews,
    getTwitter,
    getWeather
};
