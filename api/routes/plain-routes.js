const Router = require('router');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const liner = require('../util/liner');

const auditController = require('../controllers/audit-controller');
const chatterController = require('../controllers/chatter-controller');
const notesController = require('../controllers/notes-controller');
const memoController = require('../controllers/memo-controller');
const announcementController = require('../controllers/announcement-controller');

const filesController = require('../controllers/files-controller');
const Constants = require('../util/constants');

const N = Constants.NOTES_PATH;
const F = Constants.FILE_PATH;
const C = Constants.CONTEXT_ROOT;
const CA = Constants.COMMAUDITS_PATH;

const M = Constants.MEMOS_PATH;
const A = Constants.ANNOUNCEMENTS_PATH;

const opts = {mergeParams: true};

const router = new Router(opts);

const yetix = new Router(opts);
router.use(`/${C}/`, yetix);

yetix.use(bodyParser.json());
yetix.use(morgan('dev'));

yetix.get(`/${N}`, (req, res) => notesController.getAllNotes(req, res));
yetix.get(`/${N}/:id`, (req, res) => notesController.getOneNote(req, res));
yetix.post(`/${N}`, (req, res) => notesController.addNote(req, res));
yetix.put(`/${N}/:id`, (req, res) => notesController.updateNote(req, res));
yetix.delete(`/${N}/:id`, (req, res) => notesController.deleteNote(req, res));
yetix.patch(`/${N}`, (req, res) => notesController.patchNotes(req, res));

yetix.get(`/${M}`, (req, res) => memoController.getAllMemos(req, res));
yetix.get(`/${M}/:id`, (req, res) => memoController.getOneMemo(req, res));
yetix.post(`/${M}`, (req, res) => memoController.addMemo(req, res));
yetix.put(`/${M}/:id`, (req, res) => memoController.updateMemo(req, res));
yetix.delete(`/${M}/:id`, (req, res) => memoController.deleteMemo(req, res));
yetix.patch(`/${M}`, (req, res) => memoController.patchMemos(req, res));

yetix.get(`/${A}`, (req, res) => announcementController.getAllAnnouncements(req, res));
yetix.get(`/${A}/:id`, (req, res) => announcementController.getOneAnnouncement(req, res));
yetix.post(`/${A}`, (req, res) => announcementController.addAnnouncement(req, res));
yetix.put(`/${A}/:id`, (req, res) => announcementController.updateAnnouncement(req, res));
yetix.delete(`/${A}/:id`, (req, res) => announcementController.deleteAnnouncement(req, res));
yetix.patch(`/${A}`, (req, res) => announcementController.patchAnnouncements(req, res));

yetix.get(`/${CA}/:id`, (req, res) => auditController.getOneAudit(req, res));
yetix.post(`/${CA}`, (req, res) => auditController.addUpdateAudit(req, res));

yetix.get(`/${F}`, (req, res) => filesController.getAllFiles(req, res));
yetix.get(`/${F}/:id`, (req, res) => filesController.getOneFile(req, res));
yetix.post(`/${F}`, (req, res) => filesController.uploadFile(req, res));
yetix.delete(`/${F}/:id`, (req, res) => filesController.deleteFile(req, res));

yetix.get(`/news`, (req, res) => chatterController.getNews(req, res));
yetix.get(`/twitter`, (req, res) => chatterController.getTwitter(req, res));
yetix.get(`/weather`, (req, res) => chatterController.getWeather(req, res));

module.exports = router;