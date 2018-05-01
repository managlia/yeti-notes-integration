const YetiComm = require('../model/yeti-comm');
const YetiFile = require('../model/yeti-file');
const YetiAudit = require('../model/yeti-audit');

const mapRespositoryAuditToModel = (repositoryAudit) => {
    console.log('mapping audit ' + repositoryAudit );
    let yetiAudit = new YetiAudit();
    yetiAudit.commId = repositoryAudit.note_id;
    yetiAudit.userId = repositoryAudit.note_viewer_id;
    yetiAudit.firstSeenDate = repositoryAudit.note_first_retrieved_date;
    yetiAudit.lastSeenDate = repositoryAudit.note_last_retrieved_date;
    yetiAudit.haveRead = repositoryAudit.note_acknowledged;
    yetiAudit.havePinned = repositoryAudit.note_pinned;
    return yetiAudit;
};

const mapRespositoryCommToModel = (repositoryNote) => {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('mapping:::: ' + JSON.stringify(repositoryNote));
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    let yetiComm = new YetiComm();
    yetiComm.noteId = repositoryNote.note_id;
    yetiComm.creatorId = repositoryNote.note_creator_id;
    yetiComm.creatorExternalId = repositoryNote.note_creator_external_id;
    yetiComm.description = repositoryNote.note_description;
    yetiComm.value = repositoryNote.note_value;
    yetiComm.entityType = repositoryNote.linked_to_entity_type;
    yetiComm.entityId = repositoryNote.linked_to_entity_id;
    yetiComm.isArchived = repositoryNote.note_archived;
    yetiComm.createDate = repositoryNote.note_create_date;
    yetiComm.updateDate = repositoryNote.note_last_update_date;
    yetiComm.recipients = repositoryNote.recipients;
    yetiComm.type = repositoryNote.note_type;

    if( repositoryNote.na_note_id ) {
        yetiComm.audit = {
            commId: repositoryNote.na_note_id,
            userId: repositoryNote.note_viewer_id,
            firstSeenDate: repositoryNote.note_first_retrieved_date,
            lastSeenDate: repositoryNote.note_last_retrieved_date,
            haveRead: repositoryNote.note_acknowledged,
            havePinned: repositoryNote.note_pinned,
        }
    }
    return yetiComm;
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
    mapRespositoryAuditToModel,
    mapRespositoryCommToModel,
    mapRespositoryFileToModel,
    mapRequestToFile
};
