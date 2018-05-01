const parseUrl = require('parseurl');
const {URLSearchParams} = require('url');

const memoService = require('../service/memo-service');
const commValidator = require('../util/comm-validator');
const Constants = require('../util/constants');
const logger = require('../util/logger');

const getAllMemos = (req, res) => {
    logger.abcde('getting all memos whether there are fitlers or not', __function, __line, __file);
    const params = new URLSearchParams(parseUrl(req).query);
    const filterString = params.get('filter');
    var userId = req.headers['x-check-id'];

    console.log('->');
    console.log('->', JSON.stringify(req.headers));
    console.log('->', userId);
    console.log('->');


    memoService.getAllMemos('memo', userId, filterString)
        .then((result) => wrapResponse(res, result, Constants.HTTP_200));
};

const getOneMemo = (req, res) => {
    logger.abcde('getting one memo; an existing id is required', __function, __line, __file);
    const id = req.params.id;
    memoService.getOneMemo(id)
        .then((result) => wrapResponse(res, result, Constants.HTTP_200))
        .catch((err) => wrapError(res, err));
};

const addMemo = (req, res) => {
    logger.abcde('adding a memo; will get the value from the request body', __function, __line, __file);
    const memo = req.body;
    if (commValidator.commValidForAdd(memo)) {
        memoService.addMemo('memo', memo)
            .then((result) => wrapResponse(res, result, Constants.HTTP_201))
            .catch((err) => wrapResponse(res, err));
    } else {
        wrapError(res, Constants.ERROR_400);
    }
};

const updateMemo = (req, res) => {
    logger.abcde('updating an existing memo; will validate a match between body id and urlstring id', __function, __line, __file);
    const id = req.params.id;
    const memo = req.body;
    const memoId = req.body.memoId;
    if (parseInt(id) !== parseInt(memoId)) {
        wrapError(res, Constants.ERROR_400);
    } else {
        memoService.exists(id).then(
            (exists) => {
                if (exists) {
                    memoService.updateMemo(memo)
                        .then((result) => wrapResponse(res, result, Constants.HTTP_202))
                        .catch((err) => wrapError(res, err))
                } else {
                    wrapError(res, Constants.ERROR_404);
                }
            })
            .catch((err) => wrapError(res, err));
    }
};

const deleteMemo = (req, res) => {
    logger.abcde('deleting one memo; an existing id is required', __function, __line, __file);
    const id = req.params.id;
    memoService.exists(id).then(
        (exists) => {
            if (exists) {
                memoService.deleteMemo(id)
                    .then((result) => wrapResponse(res, result, Constants.HTTP_202))
                    .catch((err) => wrapError(res, err))
            } else {
                wrapError(res, Constants.ERROR_404);
            }
        })
        .catch((err) => wrapError(res, err));
};

const patchMemos = (req, res) => {
    logger.abcde('patch is not configured to do anything yet', __function, __line, __file);
    memoService.patchMemos().then((result) => wrapResponse(res, result, Constants.HTTP_200));
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
    getAllMemos,
    getOneMemo,
    addMemo,
    updateMemo,
    deleteMemo,
    patchMemos
};

