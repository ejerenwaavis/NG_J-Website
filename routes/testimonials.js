const express      = require('express');
const Testimonial  = require('../models/Testimonial');
const auth         = require('../middleware/auth');

const router = express.Router();

// GET /api/testimonials — active only, sorted by order (public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/testimonials/all — all for admin (protected)
router.get('/all', auth, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/testimonials (protected)
router.post('/', auth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.initials && data.name) {
      data.initials = data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }
    data.active = data.active === 'true' || data.active === true || data.active === undefined;
    const t = await Testimonial.create(data);
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/testimonials/:id (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.initials && data.name) {
      data.initials = data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }
    const t = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json(t);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/testimonials/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/testimonials/:id/toggle — toggle active (protected)
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    t.active = !t.active;
    await t.save();
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
