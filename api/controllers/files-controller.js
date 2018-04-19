const http = require('http');
const fs = require('fs');
const path = require('path');

const parseUrl = require('parseurl');
const {URLSearchParams} = require('url');

const Constants = require('../util/constants');
const logger = require('../util/logger');
const IncomingForm = require('formidable').IncomingForm

const fileService = require('../service/file-service');
const FileValidator = require('../util/file-validator');
const Converter = require('../util/converter');


const getAllFiles = (req, res) => {
    logger.abcde('getting all files whether there are fitlers or not', __function, __line, __file);
    const params = new URLSearchParams(parseUrl(req).query);
    const entityType = params.get('entityType');
    const entityId = params.get('entityId');
    if( !entityType || !entityId ) {
        wrapError(Constants.PARAM_ERROR, Constants.PARAM_ERROR.code);
    } else {
        fileService.getAllFiles(entityType, entityId).then((result) => wrapResponse(res, result, Constants.HTTP_200));
    }
};

const getOneFile = (req, res) => {
    logger.abcde('getting one file; an existing id is required', __function, __line, __file);
    const id = req.params.id;
    fileService.getOneFile(id)
        .then((result) => {


            res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
            // res.setHeader('Content-Transfer-Encoding', 'binary');
            res.setHeader('Content-Type', result.fileType );
            res.writeHead(200, {"Content-Type": result.fileType });
            const src = fs.createReadStream( `./${result.fileStoragePath}` );
            src.pipe(res);
            src.on('end', () => {
                res.end();
            });


            return res;
        })
        .catch((err) => wrapError(res, err));
};

const uploadFile = (req, res) => {
    logger.abcde('uploading a file!!!!', __function, __line, __file);
    const form = new IncomingForm();
    form.uploadDir = 'uploads';
    form.parse(req, function(err, fields, files) {
        if (err) {
            wrapError(Constants.ERROR_GENERAL_UPLOAD, Constants.ERROR_GENERAL_UPLOAD.code);
        } else if (!files.file) {
            wrapError(Constants.ERROR_NO_FILE, Constants.ERROR_NO_FILE.code);
        } else {
            const file = files.file;
            const payload = JSON.parse(fields.payload);
            const yetiFile = Converter.mapRequestToFile(file, payload);

            if (FileValidator.fileValidForAdd(yetiFile)) {
                fileService.addFile(yetiFile)
                    .then((result) => {
                        logger.abcde(`--->>>> success occurred: ${JSON.stringify(result)}`, __function, __line, __file);
                        wrapResponse(res, result, Constants.HTTP_201)
                    })
                    .catch((err) => {
                        logger.abcde(`--->>>> error occurred: ${JSON.stringify(err)}`, __function, __line, __file);
                        wrapResponse(res, err)
                    });
            } else {
                wrapError(res, Constants.ERROR_400);
            }
        }
    });
};

const deleteFile = (req, res) => {
    logger.abcde('deleting one file; an existing id is required', __function, __line, __file);
    const id = req.params.id;
    fileService.exists(id).then(
        (exists) => {
            if (exists) {
                fileService.deleteFile(id)
                    .then((result) => wrapResponse(res, result, Constants.HTTP_202))
                    .catch((err) => wrapError(res, err))
            } else {
                wrapError(res, Constants.ERROR_404);
            }
        })
        .catch((err) => wrapError(res, err));
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
    getAllFiles,
    getOneFile,
    deleteFile,
    uploadFile
};
