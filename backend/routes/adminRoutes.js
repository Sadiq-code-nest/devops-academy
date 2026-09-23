const router = require('express').Router();
const { adminLogin, getStudents } = require('../controllers/adminController');
const { protect, adminOnly }      = require('../middleware/authMiddleware');

router.post('/login',    adminLogin);
router.get('/students',  protect, adminOnly, getStudents);

module.exports = router;
