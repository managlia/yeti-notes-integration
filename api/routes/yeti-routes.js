const express = require('express');
const app = express();
const router = express.Router();

const notesController = require('../controllers/notes-controller');
const Constants = require('../util/constants');

const N = Constants.NOTES_PATH;

router.get(`/${N}`, notesController.getAllNotes);
router.get(`/${N}/:id`, notesController.getOneNote);
router.post(`/${N}`, notesController.addNote);
router.put(`/${N}/:id`, notesController.updateNote);
router.delete(`/${N}/:id`, notesController.deleteNote);
router.patch(`/${N}`, notesController.patchNotes);

module.exports = router;