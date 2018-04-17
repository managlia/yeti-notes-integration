const Router = require('router');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const liner = require('../util/liner');

const notesController = require('../controllers/notes-controller');
const Constants = require('../util/constants');

const N = Constants.NOTES_PATH;
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

module.exports = router;