const Note = require('../model/note');

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

module.exports = {
    mapRespositoryNoteToModel
};
