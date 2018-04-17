const chalk = require('chalk');
const parseUrl = require('parseurl');
const bodyParser = require('body-parser')
const notesService = require('../service/note-service');
const notesValidator = require('../util/notes-validator');
const { URLSearchParams } = require('url');
const jsonParser = bodyParser.json();

const log = (elem) => console.log(chalk.blue(elem));

const HTTP_200 = 200;
const HTTP_201 = 201;
const HTTP_202 = 202;
const HTTP_400 = 400;
const HTTP_404 = 404;

const ERROR_400 = {message: 'Posted data is invalid', code: HTTP_400};
const ERROR_404 = {message: 'Item not found', code: HTTP_404};

getAllNotes = (req, res) => {
    log('CONTROLLER:: getAllNotes');
    const params = new URLSearchParams(parseUrl(req).query);
    const filterString = params.get('filter');
    // with express, could use:  const filterString = req.query.filter;
    notesService.getAllNotes(filterString).then( (result) => wrapResonse(res, result, HTTP_200) );
};

getOneNote = (req, res) => {
    log('CONTROLLER:: getOneNote');
    const id = req.params.id;
    notesService.getOneNote(id)
        .then((result) => wrapResonse(res, result, HTTP_200))
        .catch((err) => wrapError(res, err));
};

addNote = (req, res) => {
    log('CONTROLLER:: addNote');
    const note = req.body;
    if( notesValidator.noteValidForAdd(note) ) {
        notesService.addNote(note)
            .then((result) => wrapResonse(res, result, HTTP_201))
            .catch((err) => wrapResonse(res, err));
    } else {
        wrapError(res, ERROR_400);
    }
};

updateNote = (req, res) => {
    log('CONTROLLER:: updateNote');
    const id = req.params.id;
    const note = req.body;
    const noteId = req.body.noteId;
    if( parseInt(id) !== parseInt(noteId) ) {
        wrapError(res, ERROR_400);
    } else {
        notesService.exists(id).then(
            (exists) => {
                if(exists) {
                    notesService.updateNote(note)
                        .then((result) => {
                            log('controller result: ' + JSON.stringify(result));
                            wrapResonse(res, result, HTTP_202)
                        })
                        .catch((err) => wrapError(res, err))
                } else {
                    wrapError(res, ERROR_404);
                }
            })
            .catch((err) => wrapError(res, err));
    }
};

deleteNote = (req, res) => {
    log('CONTROLLER:: deleteNote');
    const id = req.params.id;
    notesService.exists(id).then(
        (exists) => {
            if(exists) {
                notesService.deleteNote(id)
                    .then((result) => wrapResonse(res, result, HTTP_202))
                    .catch((err) => wrapError(res, err))
            } else {
                wrapError(res, ERROR_404);
            }
        })
    .catch((err) => wrapError(res, err));
};

patchNotes = (req, res) => {
    log('CONTROLLER:: patchNotes');
    notesService.deleteNote(id).then( (result) => wrapResonse(res, result, HTTP_202) );
};

/* private */
wrapResonse = (res, result, status) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end( JSON.stringify(result) );
    return res;
};

/* private */
wrapError = (res, err) => {
    console.error(err);
    let errorCode = err.code;
    if( !notesValidator.isValidErrorCode(errorCode) ) {
        errorCode = HTTP_400;
    }
    res.writeHead(errorCode, { 'Content-Type': 'application/json' });
    res.end( JSON.stringify(err) );
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

