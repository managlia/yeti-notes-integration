const validator = require('validator');
const validCodes = [200, 201, 202, 204, 404, 404, 500];

const fileValidForAdd = (file) => {
    return true;  // todo: add validator logic here
};

const isValidErrorCode = (errorCode) => {
    return validCodes.includes(errorCode);
};

module.exports = {
    isValidErrorCode,
    fileValidForAdd
};

