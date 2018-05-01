const commRepository = require('../integration/comm-repository');
const Constants = require('../util/constants');
const Converter = require('../util/converter');
const logger = require('../util/logger');

const getAllAnnouncements = (commType, filterString) => {
    logger.abcde(`will call one of two functions based on value of filterString (${filterString})`, __function, __line, __file);
    if (filterString) {
        return getAllWithFilter(commType, filterString);
    }
    return getAllWithoutFilter(commType);
};

const getOneAnnouncement = (id) => {
    logger.abcde(`will get one using id (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.getOneComm(id)
            .then((result) => resolve(Converter.mapRespositoryCommToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));

    });
};

const exists = (id) => {
    logger.abcde(`checking if record exists using (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.getOneOrNoneComm(id)
            .then((result) => resolve(result !== null))
            .catch((err) => resolve(standardizeError(err, Constants.HTTP_400)));
    });
};

const addAnnouncement = (commType, announcement) => {
    logger.abcde(`adding this new announcement: ${JSON.stringify(announcement)}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.addComm(commType, announcement)
            .then((result) => resolve(Converter.mapRespositoryCommToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const updateAnnouncement = (announcement) => {
    logger.abcde(`updating this existing announcement: ${JSON.stringify(announcement)}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.updateComm(announcement)
            .then((result) => resolve(Converter.mapRespositoryCommToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const deleteAnnouncement = (id) => {
    logger.abcde(`will delete one announcement using id (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.deleteComm(id)
            .then((result) => resolve(Converter.mapRespositoryCommToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const patchAnnouncements = () => {
    logger.abcde('patch is not configured to do anything yet', __function, __line, __file);
    return new Promise((resolve, reject) => {
        resolve('patch is not configured');
    });
};

/* private */
const getAllWithoutFilter = (commType) => {
    logger.abcde(`unfettered request`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.getAllAnnouncements(commType)
            .then((result) => resolve(result.map(e => Converter.mapRespositoryCommToModel(e))))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

/* private */
const getAllWithFilter = (commType, filterString) => {
    logger.abcde(`filtered request with ${filterString}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.getAllAnnouncementsFiltered(commType, filterString)
            .then((result) => resolve(result.map(e => Converter.mapRespositoryCommToModel(e))))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)))
    });
};

/* private */
const standardizeError = (error, code) => {
    logger.errro(`ERROR:: ${error}`, __function, __line, __file);
    return {
        message: error.message,
        code: code
    };
};

module.exports = {
    getAllAnnouncements,
    getOneAnnouncement,
    exists,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    patchAnnouncements
};
