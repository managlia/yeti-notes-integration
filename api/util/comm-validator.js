const validator = require('validator');
const validCodes = [200, 201, 202, 204, 404, 404, 500];


const auditValidForAdd = (audit) => {
    return true; // todo: add logic for validation
};

const commValidForAdd = (note) => {
    return requiredFieldsPopulated(note);
};

const commValidForUpdate = (note) => {
    return idPopulated(note) &&
        requiredFieldsPopulated(note);
};

const commValidForDelete = (note) => {
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
    auditValidForAdd,
    commValidForAdd,
    commValidForUpdate,
    commValidForDelete,
    isValidErrorCode
};


