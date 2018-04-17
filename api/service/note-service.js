const chalk = require('chalk');
const notesRespository = require( '../integration/notes-repository');
const Note = require('../model/notes');

const log = (elem, f, l) => console.log(chalk.cyan(`${f}(${l}): SERVICE: ${elem}`));
const logError = (elem, f, l) => console.log(chalk.red(`${f}(${l}): SERVICE: ${elem}`));

const HTTP_400 = 400;

getAllNotes = (filterString) => {
    log(`getAllNotes:: ${filterString}`, __function, __line);
    if( filterString ) {
        return getAllWithFilter(filterString);
    }
    return getAllWithoutFilter();
};

getOneNote = (id) => {
    log(`getOneNote:: ${id}`, __function, __line);
    return new Promise((resolve, reject) => {
        notesRespository.getOneNote(id)
            .then((result) => resolve(mapRespositoryNoteToModel(result)))
            .catch( (err) => reject(standardizeError(err, HTTP_400)));
    });
};

exists = (id) => {
    log(`exists:: ${id}`, __function, __line);
    return new Promise((resolve, reject) => {
        notesRespository.getOneOrNoneNote(id)
        .then((result) => {
            log(`exists decision:: ${result}`);
            resolve(result !== null);
        })
        .catch((err) => resolve(standardizeError(err, HTTP_400)));
    });
};

addNote = (note) => {
    log(`addNote:: ------> ${JSON.stringify(note)}`, __function, __line);
    return new Promise((resolve, reject) => {
        notesRespository.addNote(note)
            .then((result) => resolve(mapRespositoryNoteToModel(result)))
            .catch( (err) => reject(standardizeError(err, HTTP_400)));
    });
};

updateNote = (note) => {
    log(`updateNote:: ------> ${JSON.stringify(note)}`, __function, __line);
    return new Promise((resolve, reject) => {
        notesRespository.updateNote(note)
            .then((result) => {
                console.log('--------------------------->>>>>>>>>>>>>>> RESULT ', result);
                const updatedNote = mapRespositoryNoteToModel(result);
                console.log('--------------------------->>>>>>>>>>>>>>> updatedNote ', updatedNote);
                resolve(updatedNote)
            })
            .catch( (err) => {
                console.log('--------------------------->>>>>>>>>>>>>>> ERROR ', err);
                reject(standardizeError(err, HTTP_400))
            });
    });
};

deleteNote = (id) => {
    log(`exists:: ${id}`, __function, __line);
    return new Promise((resolve, reject) => {
        notesRespository.deleteNote(id)
            .then((result) => resolve(mapRespositoryNoteToModel(result)))
            .catch( (err) => reject(standardizeError(err, HTTP_400)));
    });
};

patchNotes = () => {
  return 'no patch configured yet';
};

getAllWithoutFilter = () => {
    return new Promise((resolve, reject) => {
        notesRespository.getAllNotes()
            .then((result) => {
                const mappedNotes = result.map(e => mapRespositoryNoteToModel(e));
                resolve(mappedNotes);
            });
    });
};

getAllWithFilter = (filterString) => {
    return new Promise((resolve, reject) => {
        notesRespository.getAllNotesFiltered(filterString)
            .then((result) => {
                const mappedNotes = result.map(e => mapRespositoryNoteToModel(e));
                resolve(mappedNotes);
            });
    });
};

mapRespositoryNoteToModel = (repositoryNote) => {
    let note = new Note();
    note.noteId = repositoryNote.note_id;
    note.creatorId = repositoryNote.note_creator_id;
    note.creatorExternalId = repositoryNote.note_creator_external_id;
    note.description = repositoryNote.note_description;
    note.value = repositoryNote.note_value;
    note.exntityType = repositoryNote.linked_to_entity_type;
    note.entityId = repositoryNote.linked_to_entity_id;
    note.isArchived = repositoryNote.note_archived;
    note.createDate = repositoryNote.note_create_date;
    note.updateDate = repositoryNote.note_last_update_date;
    return note;
};

standardizeError = (error, code) => {
    log('NNNNNNNNNNNNNNNNNNNOOOOOOOOOOOOOOOOOOOOO', __function, __line);
    logError(`ERROR:: ${error}`, __function, __line);
    return {
        message: error.message,
        code: code
    };
};

module.exports = {
  getAllNotes,
  getOneNote,
  exists,
  addNote,
  updateNote,
  deleteNote
};
