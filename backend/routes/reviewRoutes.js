const router = require('express').Router();
const { getReviews, postReview, approveReview } = require('../controllers/reviewController');
const { protect, adminOnly }                     = require('../middleware/authMiddleware');

router.get('/',                getReviews);                        // public
router.post('/',               postReview);                        // public
router.patch('/:id/approve',   protect, adminOnly, approveReview); // admin only

module.exports = router;
