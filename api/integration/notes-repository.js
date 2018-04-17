const pgp = require('pg-promise')({});
const cn = 'postgres://test:test@localhost:5432/yeti';
const db = pgp(cn);
const chalk = require('chalk');

const log = (elem, f, l) => console.log(chalk.green(`${f}(${l}): REPOSITORY: ${elem}`));

const getAllNotes = () => {
    log('getAllNotes', __function, __line);
    return db.any('SELECT * FROM public.notes');
};

const getAllNotesFiltered = (filterString) => {
    log('getAllNotes filtered with ' + filterString, __function, __line);
    return db.any(`SELECT * FROM public.notes WHERE note_value ILIKE '%$1:value%'`, [filterString] );
};

const getOneNote = (id) => {
    log(`getOneNote with id === ${id}`, __function, __line);
    return db.one(
    `SELECT * FROM
        public.notes
        WHERE note_id = $1
        LIMIT 1`,
        [id]
    );
};

const getOneOrNoneNote = (id) => {
    log(`getOneNote with id === ${id}`, __function, __line);
    return db.oneOrNone(
        `SELECT * FROM
        public.notes
        WHERE note_id = $1
        LIMIT 1`,
        [id]
    );
};


const addNote = (note) => {
  log(`addNote with note === ${JSON.stringify(note)}`, __function, __line);
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
  log(`updateNote with note === ${JSON.stringify(note)}`, __function, __line);
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
  log(`deleteNote with id === ${id}`, __function, __line);
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
  deleteNote
};
