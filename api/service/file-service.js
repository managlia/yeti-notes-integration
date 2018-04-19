const filesRepository = require('../integration/files-repository');
const Constants = require('../util/constants');
const Converter = require('../util/converter');
const logger = require('../util/logger');

const getAllFiles = (entityType, entityId) => {
    logger.abcde(`retrieving the file list for ${entityType}:${entityId}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        filesRepository.getAllFiles(entityType, entityId)
            .then((result) => resolve(result.map(e => Converter.mapRespositoryFileToModel(e))))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const getOneFile = (id) => {
    logger.abcde(`will get one using id (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        filesRepository.getOneFile(id)
            .then((result) => resolve(Converter.mapRespositoryFileToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));

    });
};

const addFile = (file) => {
    logger.abcde(`--->>>> adding this new file: ${JSON.stringify(file)}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        filesRepository.addFile(file)
            .then((result) => {
                logger.abcde(`--->>>> success occurred: ${JSON.stringify(result)}`, __function, __line, __file);
                resolve(Converter.mapRespositoryFileToModel(result))
            })
            .catch((err) => {
                logger.abcde(`--->>>> error occurred: ${JSON.stringify(err)}`, __function, __line, __file);
                reject(standardizeError(err, Constants.HTTP_400))
            });
    });
};

const deleteFile = (id) => {
    logger.abcde(`will delete one file using id (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        filesRepository.deleteFile(id)
            .then((result) => resolve(Converter.mapRespositoryFileToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const exists = (id) => {
    logger.abcde(`checking if record exists using (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        filesRepository.getOneOrNoneFile(id)
            .then((result) => resolve(result !== null))
            .catch((err) => resolve(standardizeError(err, Constants.HTTP_400)));
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
    getAllFiles,
    getOneFile,
    exists,
    addFile,
    deleteFile
};
