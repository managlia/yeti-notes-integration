const express = require('express');
const app = express();
const router = express.Router();
const notesController = require('../controllers/notes-controller');

router.get('/notes', notesController.getAllNotes);
router.get('/notes/:id', notesController.getOneNote);
router.post('/notes', notesController.addNote);
router.put('/notes/:id', notesController.updateNote);
router.delete('/notes/:id', notesController.deleteNote);
router.patch('/notes', notesController.patchNotes);

module.exports = router;