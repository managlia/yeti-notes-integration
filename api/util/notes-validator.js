const validator = require('validator');
const validCodes = [200, 201, 202, 204, 404, 404, 500];

const noteValidForAdd = (note) => {
    return requiredFieldsPopulated(note);
};

const noteValidForUpdate = (note) => {
    return idPopulated(note) &&
        requiredFieldsPopulated(note);
};

const noteValidForDelete = (note) => {
    return idPopulated(note);
};

const isValidErrorCode = (errorCode) => {
    return validCodes.includes(errorCode);
};

/* private */
const requiredFieldsPopulated = (note) => {
    return note.description &&
        note.value;
};

/* private */
const idPopulated = (note) => {
    return (note.noteId && validator.isAlphanumeric(note.noteId));
};

module.exports = {
    noteValidForAdd,
    noteValidForUpdate,
    noteValidForDelete,
    isValidErrorCode
};


