const Constants = require('../util/constants');
const logger = require('../util/logger');
const db = Constants.dbConnection;

const getAllNotes = (entityType, entityId) => {
    logger.abcde('all notes without any filter', __function, __line, __file);
    return db.any(`SELECT * FROM public.notes
            WHERE 
                  (
                  linked_to_entity_type = $1
              AND
                  linked_to_entity_id = $2
                  )          
                `, [entityType, entityId]);
};

const getAllNotesFiltered = (filterString, entityType, entityId) => {
    logger.abcde(`calling db to get filtered set of all notes (${filterString}, ${entityType}, ${entityId})`, __function, __line, __file);
    return db.any(`SELECT * FROM public.notes 
        WHERE (linked_to_entity_type = $1 AND linked_to_entity_id = $2)          
          AND (
            note_value ILIKE '%$3:value%'
                OR
            note_description ILIKE '%$3:value%'
            )
        `, [entityType, entityId, filterString]);
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
            note.entityType,
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

module.exports = {
    getAllNotes,
    getAllNotesFiltered,
    getOneNote,
    getOneOrNoneNote,
    addNote,
    updateNote,
    deleteNote
};
