const Constants = require('../util/constants');
const logger = require('../util/logger');
const db = Constants.dbConnection;

const getAllAnnouncements = (noteType) => {
    logger.abcde('all notes without any filter', __function, __line, __file);
    return db.any(`
            SELECT 
            
            
            
            
                        n.note_id,
                        n.note_creator_id,
                        n.note_creator_external_id,
                        n.note_type,
                        n.note_description,
                        n.note_value,
                        n.note_archived,
                        n.linked_to_entity_type,
                        n.linked_to_entity_id,
                        n.recipients,
                        n.note_create_date,
                        n.note_last_update_date,
                        na.note_id as na_note_id,
                        na.note_viewer_id,
                        na.note_first_retrieved_date,
                        na.note_last_retrieved_date,
                        na.note_acknowledged,
                        na.note_pinned
            
            
            
            
            
            
            
            
            
            FROM notes n
            LEFT JOIN notes_audit na
            ON	na.note_id = n.note_id
            WHERE 
            n.note_type = $1`, [noteType]);
};

const getAllAnnouncementsFiltered = (noteType, filterString) => {
    logger.abcde(`calling db to get filtered set of all notes (${filterString}`, __function, __line, __file);
    return db.any(`
            SELECT * FROM notes n
            LEFT JOIN notes_audit na
            ON	na.note_id = n.note_id
            WHERE (n.note_type = $1)
                AND (
            n.note_value ILIKE '%$2:value%'
                OR
            n.note_description ILIKE '%$2:value%'
            )
        `, [noteType, filterString]);
};

const getAllMemos = (noteType, userId) => {
    logger.abcde(`all notes without any filter ${noteType}::${userId}`, __function, __line, __file);
    return db.any(`SELECT 
                        n.note_id,
                        n.note_creator_id,
                        n.note_creator_external_id,
                        n.note_type,
                        n.note_description,
                        n.note_value,
                        n.note_archived,
                        n.linked_to_entity_type,
                        n.linked_to_entity_id,
                        n.recipients,
                        n.note_create_date,
                        n.note_last_update_date,
                        na.note_id as na_note_id,
                        na.note_viewer_id,
                        na.note_first_retrieved_date,
                        na.note_last_retrieved_date,
                        na.note_acknowledged,
                        na.note_pinned
                     FROM notes n
                        LEFT JOIN notes_audit na
                        ON	n.note_id = na.note_id
                        WHERE 
                    n.note_type = $1
                        AND
                    (  n.note_creator_id = $2 OR $2=ANY(n.recipients) )`, [noteType, userId]);
};

const getAllMemosFiltered = (noteType, userId, filterString) => {
    logger.abcde(`calling db to get filtered set of all notes (${filterString}`, __function, __line, __file);
    return db.any(`SELECT * FROM notes n
                        LEFT JOIN notes_audit na
                        ON	na.note_id = n.note_id
                        WHERE 
                    n.note_type = $1
                        AND
                    (  n.note_creator_id = $3 OR $3=ANY(n.recipients) )
          AND (
            note_value ILIKE '%$2:value%'
                OR
            note_description ILIKE '%$2:value%'
            )
        `, [noteType, filterString, userId]);
};

const getAllComms = (noteType, entityType, entityId) => {
    logger.abcde('all notes without any filter', __function, __line, __file);
    return db.any(`SELECT * FROM public.notes
            WHERE  
                note_type = $1 
              AND
                  (
                  linked_to_entity_type = $2
              AND
                  linked_to_entity_id = $3
                  )          
                `, [noteType, entityType, entityId]);
};

const getAllCommsFiltered = (noteType, filterString, entityType, entityId) => {
    logger.abcde(`calling db to get filtered set of all notes (${filterString}, ${entityType}, ${entityId})`, __function, __line, __file);
    return db.any(`SELECT * FROM public.notes 
        WHERE (linked_to_entity_type = $2 AND linked_to_entity_id = $3)   
          AND (note_type = $1)
          AND (
            note_value ILIKE '%$4:value%'
                OR
            note_description ILIKE '%$4:value%'
            )
        `, [noteType, entityType, entityId, filterString]);
};

const getOneComm = (id) => {
    logger.abcde(`calling db to get one note`, __function, __line, __file);
    return db.one(
        `SELECT * FROM
        public.notes
        WHERE note_id = $1
        LIMIT 1`,
        [id]
    );
};


const getOneAudit = (noteId, userId) => {
    logger.abcde(`calling db to get one note`, __function, __line, __file);
    return db.one(
        `SELECT * FROM
        public.notes_audit
        WHERE note_id = $1 AND
        WHERE note_id = $2
        LIMIT 1`,
        [noteId, userId]
    );
};

const addUpdateAudit = (noteAudit) => {
    logger.abcde(`calling db to insert or update an audit record`, __function, __line, __file);
    return db.one(`
        INSERT INTO public.notes_audit
            (note_id, note_viewer_id, note_first_retrieved_date, note_last_retrieved_date,
             note_acknowledged, note_pinned)
            VALUES
            ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (note_id, note_viewer_id)
        DO UPDATE SET 
            note_last_retrieved_date = $4,
            note_acknowledged = $5,
            note_pinned = $6
        RETURNING
            *`,
        [noteAudit.commId, noteAudit.userId, noteAudit.firstSeenDate,
         noteAudit.lastSeenDate, noteAudit.haveRead, noteAudit.havePinned]
    );
};

const getOneOrNoneComm = (id) => {
    logger.abcde(`calling db to get one (or none) note to see if it exists`, __function, __line, __file);
    return db.oneOrNone(
        `SELECT * FROM
        public.notes
        WHERE note_id = $1
        LIMIT 1`,
        [id]
    );
};

const addComm = (noteType, note) => {
    logger.abcde(`calling db to add a new note`, __function, __line, __file);
    return db.one(`
        INSERT INTO public.notes
            (note_creator_id, note_creator_external_id, note_type, note_description,
             note_value, linked_to_entity_type, linked_to_entity_id, recipients)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING
            *`,
        [note.creatorId,
            note.creatorExternalId,
            noteType,
            note.description,
            note.value,
            note.entityType,
            note.entityId,
            note.recipients]
    );
};

const updateComm = (note) => {
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

const deleteComm = (id) => {
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
    getAllAnnouncements,
    getAllAnnouncementsFiltered,
    getAllMemos,
    getAllMemosFiltered,
    getAllComms,
    getAllCommsFiltered,
    getOneComm,
    getOneOrNoneComm,
    addComm,
    updateComm,
    deleteComm,
    getOneAudit,
    addUpdateAudit
};
