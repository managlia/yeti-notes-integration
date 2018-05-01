const parseUrl = require('parseurl');
const {URLSearchParams} = require('url');

const auditService = require('../service/audit-service');
const commValidator = require('../util/comm-validator');
const Constants = require('../util/constants');
const logger = require('../util/logger');

const getOneAudit = (req, res) => {
    logger.abcde('getting one audit; an existing noteId and userId on header are required', __function, __line, __file);
    const noteId = req.params.id;
    var userId = req.headers['X-CHECK-ID'];
    auditService.getOneAudit(noteId, userId)
        .then((result) => wrapResponse(res, result, Constants.HTTP_200))
        .catch((err) => wrapError(res, err));
};

const addUpdateAudit = (req, res) => {
    logger.abcde('adding or updating an audit; will get the value from the request body', __function, __line, __file);
    const audit = req.body;
    if (commValidator.auditValidForAdd(audit)) {
        auditService.addUpdateAudit( audit )
            .then((result) => wrapResponse(res, result, Constants.HTTP_201))
            .catch((err) => wrapResponse(res, err));
    } else {
        wrapError(res, Constants.ERROR_400);
    }
};

/* private */
const wrapResponse = (res, result, status) => {
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(result));
    return res;
};

/* private */
const wrapError = (res, err) => {
    console.error(err);
    let errorCode = err.code;
    if (!commValidator.isValidErrorCode(errorCode)) {
        errorCode = Constants.HTTP_400;
    }
    res.writeHead(errorCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(err));
    return res;
};


module.exports = {
    getOneAudit,
    addUpdateAudit
};
