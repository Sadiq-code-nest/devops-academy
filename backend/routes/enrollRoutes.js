const router = require('express').Router();
const { submitEnroll, getEnrollments } = require('../controllers/enrollController');
const { protect, adminOnly }           = require('../middleware/authMiddleware');

router.post('/',  submitEnroll);                       // public
router.get('/',   protect, adminOnly, getEnrollments); // admin only

module.exports = router;
