const chatterRepository = require('../integration/chatter-repository');
const Constants = require('../util/constants');
const Converter = require('../util/converter');
const logger = require('../util/logger');

const getNews = (filterString) => {
    logger.abcde(`will call one of two functions based on value of filterString (${filterString})`, __function, __line, __file);
        return chatterRepository.getNews(filterString);
};

const getTwitter = (filterString) => {
    logger.abcde(`will call one of two functions based on value of filterString (${filterString})`, __function, __line, __file);
    return chatterRepository.getTwitter(filterString);
};

const getWeather = (filterString) => {
    logger.abcde(`will call one of two functions based on value of filterString (${filterString})`, __function, __line, __file);
    return chatterRepository.getWeather(filterString);
};

module.exports = {
    getNews,
    getTwitter,
    getWeather
};
