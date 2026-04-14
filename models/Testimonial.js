const { Schema, model } = require('mongoose');

const TestimonialSchema = new Schema({
  name:     { type: String, required: true },
  company:  { type: String, required: true },
  role:     { type: String },
  text:     { type: String, required: true },
  rating:   { type: Number, default: 5, min: 1, max: 5 },
  initials: { type: String },
  color:    { type: String, default: 'linear-gradient(135deg,#E8520A,#FF6B2B)' },
  active:   { type: Boolean, default: true },
  order:    { type: Number, default: 0 }
}, { timestamps: true });

module.exports = model('Testimonial', TestimonialSchema);
