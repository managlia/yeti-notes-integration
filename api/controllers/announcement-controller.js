const parseUrl = require('parseurl');
const {URLSearchParams} = require('url');

const announcementService = require('../service/announcement-service');
const commValidator = require('../util/comm-validator');
const Constants = require('../util/constants');
const logger = require('../util/logger');

const getAllAnnouncements = (req, res) => {
    logger.abcde('getting all announcements whether there are fitlers or not', __function, __line, __file);
    const params = new URLSearchParams(parseUrl(req).query);
    const filterString = params.get('filter');
    announcementService.getAllAnnouncements('announcement', filterString).then((result) => wrapResponse(res, result, Constants.HTTP_200));
};

const getOneAnnouncement = (req, res) => {
    logger.abcde('getting one announcement; an existing id is required', __function, __line, __file);
    const id = req.params.id;
    announcementService.getOneAnnouncement(id)
        .then((result) => wrapResponse(res, result, Constants.HTTP_200))
        .catch((err) => wrapError(res, err));
};

const addAnnouncement = (req, res) => {
    logger.abcde('adding a announcement; will get the value from the request body', __function, __line, __file);
    const announcement = req.body;
    if (commValidator.commValidForAdd(announcement)) {
        announcementService.addAnnouncement('announcement', announcement)
            .then((result) => wrapResponse(res, result, Constants.HTTP_201))
            .catch((err) => wrapResponse(res, err));
    } else {
        wrapError(res, Constants.ERROR_400);
    }
};

const updateAnnouncement = (req, res) => {
    logger.abcde('updating an existing announcement; will validate a match between body id and urlstring id', __function, __line, __file);
    const id = req.params.id;
    const announcement = req.body;
    const announcementId = req.body.announcementId;
    if (parseInt(id) !== parseInt(announcementId)) {
        wrapError(res, Constants.ERROR_400);
    } else {
        announcementService.exists(id).then(
            (exists) => {
                if (exists) {
                    announcementService.updateAnnouncement(announcement)
                        .then((result) => wrapResponse(res, result, Constants.HTTP_202))
                        .catch((err) => wrapError(res, err))
                } else {
                    wrapError(res, Constants.ERROR_404);
                }
            })
            .catch((err) => wrapError(res, err));
    }
};

const deleteAnnouncement = (req, res) => {
    logger.abcde('deleting one announcement; an existing id is required', __function, __line, __file);
    const id = req.params.id;
    announcementService.exists(id).then(
        (exists) => {
            if (exists) {
                announcementService.deleteAnnouncement(id)
                    .then((result) => wrapResponse(res, result, Constants.HTTP_202))
                    .catch((err) => wrapError(res, err))
            } else {
                wrapError(res, Constants.ERROR_404);
            }
        })
        .catch((err) => wrapError(res, err));
};

const patchAnnouncements = (req, res) => {
    logger.abcde('patch is not configured to do anything yet', __function, __line, __file);
    announcementService.patchAnnouncements().then((result) => wrapResponse(res, result, Constants.HTTP_200));
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
    getAllAnnouncements,
    getOneAnnouncement,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    patchAnnouncements
};

