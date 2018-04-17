const validator = require('validator');
const validCodes = [200,201,202,204,404,404,500];

noteValidForAdd = (note) => {
    return requiredFieldsPopulated(note);
};

noteValidForUpdate = (note) => {
    return idPopulated(note) &&
        requiredFieldsPopulated(note);
};

noteValidForDelete = (note) => {
    return idPopulated(note);
};


isValidErrorCode = (errorCode) => {
    return validCodes.includes( errorCode );
};

/* private */
requiredFieldsPopulated = (note) => {
    return  note.description &&
            note.value;
};

/* private */
idPopulated = (note) => {
    return  (note.noteId && validator.isAlphanumeric(note.noteId));
};

module.exports = {
    noteValidForAdd,
    noteValidForUpdate,
    noteValidForDelete,
    isValidErrorCode
};


