const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  module: { type: String, required: true },
  description: { type: String },
  fields: { type: Array, default: [] },
  company: { type: String, ref: 'Company', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound unique index for module + company
ModuleSchema.index({ module: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Module', ModuleSchema);
