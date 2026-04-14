const express    = require('express');
const TeamMember = require('../models/TeamMember');
const auth       = require('../middleware/auth');

const router = express.Router();

// GET /api/team — active, sorted by order (public)
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find({ active: true }).sort({ order: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/team/all — all for admin (protected)
router.get('/all', auth, async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/team (protected)
router.post('/', auth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.initials && data.name) {
      data.initials = data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }
    data.active = data.active !== 'false' && data.active !== false;
    const m = await TeamMember.create(data);
    res.status(201).json(m);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/team/:id (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.initials && data.name) {
      data.initials = data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }
    const m = await TeamMember.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json(m);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/team/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const m = await TeamMember.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
