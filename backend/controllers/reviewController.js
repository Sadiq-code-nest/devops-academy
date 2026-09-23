const Review = require('../models/Review');

// GET /api/reviews  (public — approved only)
exports.getReviews = async (_req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/reviews  (public)
exports.postReview = async (req, res) => {
  try {
    const { name, role, rating, text, transformation } = req.body;
    if (!name || !rating || !text)
      return res.status(400).json({ message: 'Name, rating and text required' });

    const review = await Review.create({ name, role, rating, text, transformation });
    res.status(201).json({ message: 'Review submitted for approval', id: review._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/reviews/:id/approve  (admin only)
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review approved', review });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
