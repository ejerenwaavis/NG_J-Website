const { Schema, model } = require('mongoose');

const TeamMemberSchema = new Schema({
  name:     { type: String, required: true },
  role:     { type: String, required: true },
  bio:      { type: String, required: true },
  initials: { type: String },
  gradient: { type: String, default: 'linear-gradient(135deg,#1A2E4A,#233A5C)' },
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true }
}, { timestamps: true });

module.exports = model('TeamMember', TeamMemberSchema);
