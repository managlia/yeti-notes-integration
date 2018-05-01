const commRepository = require('../integration/comm-repository');
const Constants = require('../util/constants');
const Converter = require('../util/converter');
const logger = require('../util/logger');

const getOneAudit = (noteId, userId) => {
    logger.abcde(`will get one using id (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.getOneAudit(noteId, userId)
            .then((result) => resolve(Converter.mapRespositoryAuditToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));

    });
};

const addUpdateAudit = (audit) => {
    logger.abcde(`adding or updating this audit : ${JSON.stringify(audit)}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        commRepository.addUpdateAudit(audit)
            .then((result) => resolve(Converter.mapRespositoryAuditToModel(result)))
            .catch((err) => {
                console.log('err -->');
                console.log('err -->');
                console.log('err -->');
                console.log('err -->', err);
                console.log('err -->');
                console.log('err -->');
                console.log('err -->');
                reject(standardizeError(err, Constants.HTTP_400))

            });
    });
};

module.exports = {
    getOneAudit,
    addUpdateAudit
};
