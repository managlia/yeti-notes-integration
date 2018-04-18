const notesRespository = require('../integration/notes-repository');
const Constants = require('../util/constants');
const Converter = require('../util/converter');
const logger = require('../util/logger');

const getAllNotes = (filterString) => {
    logger.abcde(`will call one of two functions based on value of filterString (${filterString})`, __function, __line, __file);
    if (filterString) {
        return getAllWithFilter(filterString);
    }
    return getAllWithoutFilter();
};

const getOneNote = (id) => {
    logger.abcde(`will get one using id (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        notesRespository.getOneNote(id)
            .then((result) => resolve(Converter.mapRespositoryNoteToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));

    });
};

const exists = (id) => {
    logger.abcde(`checking if record exists using (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        notesRespository.getOneOrNoneNote(id)
            .then((result) => resolve(result !== null))
            .catch((err) => resolve(standardizeError(err, Constants.HTTP_400)));
    });
};

const addNote = (note) => {
    logger.abcde(`adding this new note: ${JSON.stringify(note)}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        notesRespository.addNote(note)
            .then((result) => resolve(Converter.mapRespositoryNoteToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const updateNote = (note) => {
    logger.abcde(`updating this existing note: ${JSON.stringify(note)}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        notesRespository.updateNote(note)
            .then((result) => resolve(Converter.mapRespositoryNoteToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const deleteNote = (id) => {
    logger.abcde(`will delete one note using id (${id})`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        notesRespository.deleteNote(id)
            .then((result) => resolve(Converter.mapRespositoryNoteToModel(result)))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

const patchNotes = () => {
    logger.abcde('patch is not configured to do anything yet', __function, __line, __file);
    return new Promise((resolve, reject) => {
        resolve('patch is not configured');
    });
};

/* private */
const getAllWithoutFilter = () => {
    logger.abcde(`unfettered request`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        notesRespository.getAllNotes()
            .then((result) => resolve(result.map(e => Converter.mapRespositoryNoteToModel(e))))
            .catch((err) => reject(standardizeError(err, Constants.HTTP_400)));
    });
};

/* private */
const getAllWithFilter = (filterString) => {
    logger.abcde(`filtered request with ${filterString}`, __function, __line, __file);
    return new Promise((resolve, reject) => {
        notesRespository.getAllNotesFiltered(filterString)
            .then((result) => resolve(result.map(e => Converter.mapRespositoryNoteToModel(e))))
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
    getAllNotes,
    getOneNote,
    exists,
    addNote,
    updateNote,
    deleteNote,
    patchNotes
};
