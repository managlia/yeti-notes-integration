const pgp = require('pg-promise')({});
const Constants = require('../util/constants');
const logger = require('../util/logger');

const db = pgp(Constants.PG_PATH);

const getAllNotes = () => {
    logger.abcde('all notes without any filter', __function, __line, __file);
    return db.any('SELECT * FROM public.notes');
};

const getAllNotesFiltered = (filterString) => {
    logger.abcde(`calling db to get filtered set of all notes`, __function, __line, __file);
    return db.any(`SELECT * FROM public.notes 
        WHERE 
        note_value ILIKE '%$1:value%'
        OR
        note_description ILIKE '%$1:value%'`, [filterString]);
};

const getOneNote = (id) => {
    logger.abcde(`calling db to get one note`, __function, __line, __file);
    return db.one(
        `SELECT * FROM
        public.notes
        WHERE note_id = $1
        LIMIT 1`,
        [id]
    );
};

const getOneOrNoneNote = (id) => {
    logger.abcde(`calling db to get one (or none) note to see if it exists`, __function, __line, __file);
    return db.oneOrNone(
        `SELECT * FROM
        public.notes
        WHERE note_id = $1
        LIMIT 1`,
        [id]
    );
};

const addNote = (note) => {
    logger.abcde(`calling db to add a new note`, __function, __line, __file);
    return db.one(`
        INSERT INTO public.notes
            (note_creator_id, note_creator_external_id, note_description,
             note_value, linked_to_entity_type, linked_to_entity_id)
            VALUES
            ($1, $2, $3, $4, $5, $6)
          RETURNING
            *`,
        [note.creatorId,
            note.creatorExternalId,
            note.description,
            note.value,
            note.exntityType,
            note.entityId]
    );
};

const updateNote = (note) => {
    logger.abcde(`calling db to update an existing note`, __function, __line, __file);
    return db.one(`
        UPDATE public.notes
        SET note_description = $2,
            note_value = $3,
            note_archived = $4
        WHERE
          note_id = $1
        RETURNING
            *`,
        [note.noteId,
            note.description,
            note.value,
            note.isArchived]
    );
};

const deleteNote = (id) => {
    logger.abcde(`calling db to delete an existing note`, __function, __line, __file);
    return db.any(
        `DELETE FROM
          public.notes
          WHERE
            note_id = $1
          RETURNING
            * `,
        [id]
    );
};

const closeConnection = () => {
    pgp.end();
};

module.exports = {
    getAllNotes,
    getAllNotesFiltered,
    getOneNote,
    getOneOrNoneNote,
    addNote,
    updateNote,
    deleteNote,
    closeConnection
};
