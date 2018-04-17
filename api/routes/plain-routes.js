var Router = require('router');
const bodyParser = require('body-parser');
var morgan = require('morgan');
const liner = require('../util/liner');

const notesController = require('../controllers/notes-controller');

const router = new Router();

var yetix = Router();
router.use('/yetix/', yetix);

yetix.use( bodyParser.json() );
yetix.use(morgan('dev'));


yetix.get('/notes', (req, res) => notesController.getAllNotes(req, res));
yetix.get('/notes/:id', (req, res) => notesController.getOneNote(req, res));
yetix.post('/notes', (req, res) => notesController.addNote(req, res));
yetix.put('/notes/:id', (req, res) => notesController.updateNote(req, res));
yetix.delete('/notes/:id', (req, res) => notesController.deleteNote(req, res));
yetix.patch('/notes',  (req, res) => notesController.patchNotes(req, res));

module.exports = router;