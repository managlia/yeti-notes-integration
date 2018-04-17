const parseUrl = require('parseurl');
const {URLSearchParams} = require('url');

const notesService = require('../service/note-service');
const notesValidator = require('../util/notes-validator');
const Constants = require('../util/constants');
const logger = require('../util/logger');

getAllNotes = (req, res) => {
    logger.abcde('bbb getting all notes whether there are fitlers or not', __function, __line, __file);
    const params = new URLSearchParams(parseUrl(req).query);
    const filterString = params.get('filter');
    // with express, could use:  const filterString = req.query.filter;
    notesService.getAllNotes(filterString).then((result) => wrapResonse(res, result, Constants.HTTP_200));
};

getOneNote = (req, res) => {
    logger.abcde('getting one note; an existing id is required', __function, __line, __file);
    const id = req.params.id;
    notesService.getOneNote(id)
        .then((result) => wrapResonse(res, result, Constants.HTTP_200))
        .catch((err) => wrapError(res, err));
};

addNote = (req, res) => {
    logger.abcde('adding a note; will get the value from the request body', __function, __line, __file);
    const note = req.body;
    if (notesValidator.noteValidForAdd(note)) {
        notesService.addNote(note)
            .then((result) => wrapResonse(res, result, Constants.HTTP_201))
            .catch((err) => wrapResonse(res, err));
    } else {
        wrapError(res, Constants.ERROR_400);
    }
};

updateNote = (req, res) => {
    logger.abcde('updating an existing note; will validate a match between body id and urlstring id', __function, __line, __file);
    const id = req.params.id;
    const note = req.body;
    const noteId = req.body.noteId;
    if (parseInt(id) !== parseInt(noteId)) {
        wrapError(res, Constants.ERROR_400);
    } else {
        notesService.exists(id).then(
            (exists) => {
                if (exists) {
                    notesService.updateNote(note)
                        .then((result) => wrapResonse(res, result, Constants.HTTP_202))
                        .catch((err) => wrapError(res, err))
                } else {
                    wrapError(res, Constants.ERROR_404);
                }
            })
            .catch((err) => wrapError(res, err));
    }
};

deleteNote = (req, res) => {
    logger.abcde('deleting one note; an existing id is required', __function, __line, __file);
    const id = req.params.id;
    notesService.exists(id).then(
        (exists) => {
            if (exists) {
                notesService.deleteNote(id)
                    .then((result) => wrapResonse(res, result, Constants.HTTP_202))
                    .catch((err) => wrapError(res, err))
            } else {
                wrapError(res, Constants.ERROR_404);
            }
        })
        .catch((err) => wrapError(res, err));
};

patchNotes = (req, res) => {
    logger.abcde('patch is not configured to do anything yet', __function, __line, __file);
    notesService.patchNotes().then((result) => wrapResonse(res, result, Constants.HTTP_200));
};

/* private */
wrapResonse = (res, result, status) => {
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(result));
    return res;
};

/* private */
wrapError = (res, err) => {
    console.error(err);
    let errorCode = err.code;
    if (!notesValidator.isValidErrorCode(errorCode)) {
        errorCode = Constants.HTTP_400;
    }
    res.writeHead(errorCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(err));
    return res;
};

module.exports = {
    getAllNotes,
    getOneNote,
    addNote,
    updateNote,
    deleteNote,
    patchNotes
};

