const { Schema, model } = require('mongoose');

const ProjectSchema = new Schema({
  title:       { type: String, required: true },
  category:    { type: String, required: true, enum: ['Land', 'Ocean', 'Air', 'Warehousing', 'Project Cargo', 'Global Logistics'] },
  description: { type: String, required: true },
  client:      { type: String },
  location:    { type: String },
  year:        { type: Number },
  image:       { type: String },
  featured:    { type: Boolean, default: false },
  tags:        [{ type: String }],
  createdAt:   { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = model('Project', ProjectSchema);
