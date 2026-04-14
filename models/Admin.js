const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new Schema({
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  name:      { type: String, default: 'NG&J Admin' },
  createdAt: { type: Date, default: Date.now }
});

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

AdminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = model('Admin', AdminSchema);
