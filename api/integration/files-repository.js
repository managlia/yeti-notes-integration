const Constants = require('../util/constants');
const logger = require('../util/logger');

const db = Constants.dbConnection;

const getAllFiles = (entityType, entityId) => {
    logger.abcde('all files without any filter', __function, __line, __file);
    return db.any(`SELECT * FROM public.files
            WHERE (
                  linked_to_entity_type = $1
              AND
                  linked_to_entity_id = $2
              )`, [entityType, entityId]);
};

const getOneFile = (id) => {
    logger.abcde(`calling db to get one file`, __function, __line, __file);
    return db.one(
        `SELECT * FROM
        public.files
        WHERE file_id = $1
        LIMIT 1`,
        [id]
    );
};

const getOneOrNoneFile = (id) => {
    logger.abcde(`calling db to get one (or none) file to see if it exists`, __function, __line, __file);
    return db.oneOrNone(
        `SELECT * FROM
        public.files
        WHERE file_id = $1
        LIMIT 1`,
        [id]
    );
};

const addFile = (file) => {
    logger.abcde(`calling db to add a new file`, __function, __line, __file);
    return db.one(`
        INSERT INTO public.files (
                file_storage_path, 
                file_original_name, 
                file_type,
                file_size, 
                file_uploader_id, 
                file_uploader_external_id, 
                linked_to_entity_type, 
                linked_to_entity_id
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              RETURNING *`, [
        file.fileStoragePath,
        file.fileName,
        file.fileType,
        file.fileSize,
        file.uploaderId,
        file.uploaderExternalId,
        file.entityType,
        file.entityId
    ]);
};

const deleteFile = (id) => {
    logger.abcde(`calling db to delete an existing file`, __function, __line, __file);
    return db.any(
        `DELETE FROM
          public.files
          WHERE
            file_id = $1
          RETURNING
            * `,
        [id]
    );
};

module.exports = {
    getAllFiles,
    getOneFile,
    getOneOrNoneFile,
    addFile,
    deleteFile
};
