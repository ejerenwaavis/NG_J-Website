const express  = require('express');
const Service  = require('../models/Service');
const auth     = require('../middleware/auth');
const upload   = require('../middleware/upload');

const router = express.Router();

// GET /api/services — active, sorted by order (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/services/all — all for admin (protected)
router.get('/all', auth, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/services (protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = '/uploads/' + req.file.filename;
    data.wide   = data.wide   === 'true' || data.wide   === true;
    data.enhanced = data.enhanced === 'true' || data.enhanced === true;
    data.active = data.active !== 'false' && data.active !== false;
    const s = await Service.create(data);
    res.status(201).json(s);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/services/:id (protected)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = '/uploads/' + req.file.filename;
    data.wide   = data.wide   === 'true' || data.wide   === true;
    data.enhanced = data.enhanced === 'true' || data.enhanced === true;
    data.active = data.active !== 'false' && data.active !== false;
    const s = await Service.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json(s);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/services/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const s = await Service.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
