const mongoose = require('mongoose');

const Module = require('../models/Module.model');
exports.addField = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const field = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    };

    const module = await Module.findByIdAndUpdate(
      moduleId,
      { $push: { fields: field } },
      { new: true }
    );

    if (!module) return res.status(404).json({ message: 'Module not found' });

    res.status(200).json({ message: 'Field added successfully', data: module });
  } catch (err) {
    console.error('Add field error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFieldById = async (req, res) => {
  try {
    const { moduleId, fieldId } = req.params;
    const updatedField = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const fieldIndex = module.fields.findIndex(
      f => f && f._id && f._id.toString() === fieldId
    );

    if (fieldIndex === -1) {
      return res.status(404).json({ message: 'Field not found' });
    }

    const originalField = module.fields[fieldIndex];

    module.fields[fieldIndex] = {
      ...originalField.toObject?.(), // safe if Mongoose document
      ...updatedField,
      _id: originalField._id
    };

    await module.save();

    res.status(200).json({
      message: 'Field updated successfully',
      data: module.fields[fieldIndex]
    });

  } catch (err) {
    console.error('Update field by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// ❌ Delete a field by index
exports.deleteFieldById = async (req, res) => {
  try {
    const { moduleId, fieldId } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const fieldIndex = module.fields.findIndex(f => f._id.toString() === fieldId);
    if (fieldIndex === -1) return res.status(404).json({ message: 'Field not found' });

    module.fields.splice(fieldIndex, 1);
    await module.save();

    res.status(200).json({ message: 'Field deleted', data: module });
  } catch (err) {
    console.error('Delete field by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// 📄 Get all fields
exports.getFields = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    res.status(200).json({ data: module.fields });
  } catch (err) {
    console.error('Get fields error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getFieldById = async (req, res) => {
  try {
    const { moduleId, fieldId } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const field = module.fields.find(f => f._id.toString() === fieldId);
    if (!field) return res.status(404).json({ message: 'Field not found' });

    res.status(200).json({ field });
  } catch (err) {
    console.error('Get field by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
