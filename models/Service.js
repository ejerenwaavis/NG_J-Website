const { Schema, model } = require('mongoose');

const ServiceSchema = new Schema({
  title:       { type: String, required: true },
  category:    { type: String, required: true },
  chip:        { type: String },
  description: { type: String, required: true },
  image:       { type: String },
  wide:        { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  active:      { type: Boolean, default: true }
}, { timestamps: true });

module.exports = model('Service', ServiceSchema);
