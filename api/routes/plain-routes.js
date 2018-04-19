const Router = require('router');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const liner = require('../util/liner');

const notesController = require('../controllers/notes-controller');
const filesController = require('../controllers/files-controller');
const Constants = require('../util/constants');

const N = Constants.NOTES_PATH;
const F = Constants.FILE_PATH;
const C = Constants.CONTEXT_ROOT;

const opts = {mergeParams: true};

const router = new Router(opts);

const yetix = new Router(opts);
router.use(`/${C}/`, yetix);

yetix.use(bodyParser.json());
yetix.use(morgan('dev'));

yetix.get(`/${N}`, (req, res) => notesController.getAllNotes(req, res));
yetix.get(`/${N}/:id`, (req, res) => notesController.getOneNote(req, res));
yetix.post(`/${N}`, (req, res) => notesController.addNote(req, res));
yetix.put(`/${N}/:id`, (req, res) => notesController.updateNote(req, res));
yetix.delete(`/${N}/:id`, (req, res) => notesController.deleteNote(req, res));
yetix.patch(`/${N}`, (req, res) => notesController.patchNotes(req, res));

yetix.get(`/${F}`, (req, res) => filesController.getAllFiles(req, res));
yetix.get(`/${F}/:id`, (req, res) => filesController.getOneFile(req, res));
yetix.post(`/${F}`, (req, res) => filesController.uploadFile(req, res));
yetix.delete(`/${F}/:id`, (req, res) => filesController.deleteFile(req, res));

module.exports = router;