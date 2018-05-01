const pgp = require('pg-promise')({});
const PG_PATH = 'postgres://test:test@localhost:5432/yeti';

exports.HTTP_200 = 200;
exports.HTTP_201 = 201;
exports.HTTP_202 = 202;
exports.HTTP_400 = 400;
exports.HTTP_404 = 404;

exports.ERROR_400 = {message: 'Posted data is invalid', code: 400};
exports.ERROR_404 = {message: 'Item not found', code: 404};
exports.PARAM_ERROR = {message: 'Posted data is invalid. EntityType and EntityId are required.', code: 400};
exports.ERROR_GENERAL_UPLOAD = {message: 'Unspecified problem with file upload', code: 400};
exports.ERROR_NO_FILE = {message: 'No file was included in the upload.', code: 400};

exports.CONTEXT_ROOT = 'yetix';
exports.NOTES_PATH = 'notes';
exports.FILE_PATH = 'files';
exports.MEMOS_PATH = 'memos';
exports.ANNOUNCEMENTS_PATH = 'announcements';
exports.COMMAUDITS_PATH = 'commaudits';

exports.dbConnection = pgp(PG_PATH);


