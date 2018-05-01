const commRepository = require('../integration/comm-repository');
const Constants = require('../util/constants');
const Converter = require('../util/converter');
const logger = require('../util/logger');

const getAllMemos = (commType, userId, filterString) => {
    logger.abcde(`will call one of two functions based on value of filterString (${filterString})`, __function, __line, __file);
    if (filterString) {
        return getAllWithFilter(commType, userId, filterString);
    }
    return getAllWithoutFilter(commType, userId);
};

const getOneMemo = (id) => {
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

const addMemo = (commType, memo) => {
    logger.abcde(`adding this new memo: ${JSON.stringify(memo)}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.addComm(commType, memo)
            .then((result) => resolve(Converter.mapRespositoryCommToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const updateMemo = (memo) => {
    logger.abcde(`updating this existing memo: ${JSON.stringify(memo)}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.updateComm(memo)
            .then((result) => resolve(Converter.mapRespositoryCommToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const deleteMemo = (id) => {
    logger.abcde(`will delete one memo using id (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.deleteComm(id)
            .then((result) => resolve(Converter.mapRespositoryCommToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const patchMemos = () => {
    logger.abcde('patch is not configured to do anything yet', __function, __line, __file);
    return new Promise((resolve, reject) => {
        resolve('patch is not configured');
    });
};

/* private */
const getAllWithoutFilter = (commType, userId) => {
    logger.abcde(`unfettered request for ${commType}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.getAllMemos(commType, userId)
            .then((result) => resolve(result.map(e => Converter.mapRespositoryCommToModel(e))))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

/* private */
const getAllWithFilter = (commType, userId, filterString) => {
    logger.abcde(`filtered request with ${filterString}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.getAllMemosFiltered(commType, userId, filterString)
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
    getAllMemos,
    getOneMemo,
    exists,
    addMemo,
    updateMemo,
    deleteMemo,
    patchMemos
};
