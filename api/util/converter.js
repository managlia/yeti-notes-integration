const YetiNote = require('../model/yeti-note');
const YetiFile = require('../model/yeti-file');

const mapRespositoryNoteToModel = (repositoryNote) => {
    let yetiNote = new YetiNote();
    yetiNote.noteId = repositoryNote.note_id;
    yetiNote.creatorId = repositoryNote.note_creator_id;
    yetiNote.creatorExternalId = repositoryNote.note_creator_external_id;
    yetiNote.description = repositoryNote.note_description;
    yetiNote.value = repositoryNote.note_value;
    yetiNote.entityType = repositoryNote.linked_to_entity_type;
    yetiNote.entityId = repositoryNote.linked_to_entity_id;
    yetiNote.isArchived = repositoryNote.note_archived;
    yetiNote.createDate = repositoryNote.note_create_date;
    yetiNote.updateDate = repositoryNote.note_last_update_date;
    return yetiNote;
};

const mapRespositoryFileToModel = (repositoryFile) => {
    let yetiFile = new YetiFile();
    yetiFile.fileId = repositoryFile.file_id;
    yetiFile.fileStoragePath = repositoryFile.file_storage_path;
    yetiFile.fileName = repositoryFile.file_original_name;
    yetiFile.fileType = repositoryFile.file_type;
    yetiFile.fileSize = repositoryFile.file_size;
    yetiFile.uploaderId = repositoryFile.file_uploader_id;
    yetiFile.uploaderExternalId = repositoryFile.file_uploader_external_id;
    yetiFile.entityType = repositoryFile.linked_to_entity_type;
    yetiFile.entityId = repositoryFile.linked_to_entity_id;
    yetiFile.storageDate = repositoryFile.file_storage_date;
    return yetiFile;
};

const mapRequestToFile = (file, payload) => {
    let yetiFile = new YetiFile();
    yetiFile.fileStoragePath = file.path;
    yetiFile.fileName = file.name;
    yetiFile.fileType = file.type;
    yetiFile.fileSize = file.size;
    yetiFile.uploaderId = payload.uploaderId;
    yetiFile.uploaderExternalId = payload.uploaderExternalId;
    yetiFile.entityType = payload.entityType;
    yetiFile.entityId = payload.entityId;
    return yetiFile;
};

module.exports = {
    mapRespositoryNoteToModel,
    mapRespositoryFileToModel,
    mapRequestToFile
};
