const Module = require('../models/Module.model');

// Create new module
exports.createModule = async (req, res) => {
  try {
    const { module, description } = req.body;
    const company = req.user.company;
    const createdBy = req.user.id;

    if (!module) {
      return res.status(400).json({ success: false, message: 'Module name is required' });
    }

    const existing = await Module.findOne({ module, company });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Module already exists for this company' });
    }

    const newModule = await Module.create({
      module,
      description,
      company,
      createdBy
    });

    res.status(201).json({ success: true, data: newModule });
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all modules for logged-in user's company
exports.getModules = async (req, res) => {
  try {
    const company = req.user.company;
    const modules = await Module.find({ company }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get a single module by ID (only if belongs to user's company)
exports.getModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = req.user.company;

    const module = await Module.findOne({ _id: id, company });
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    res.status(200).json({ success: true, data: module });
  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { module, description, fields } = req.body;
    const company = req.user.company;

    const mod = await Module.findOne({ _id: id, company });
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    if (module) mod.module = module;
    if (description) mod.description = description;
    if (fields) mod.fields = fields; // update dynamic fields array

    await mod.save();

    res.status(200).json({ success: true, data: mod });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    const company = req.user.company;

    const mod = await Module.findOneAndDelete({ _id: id, company });
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    res.status(200).json({ success: true, message: 'Module deleted' });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
// Assuming you have user info (company and role) in req.user

// Import your Module model at top
exports.getModulesByCompanyAndRole = async (req, res) => {
  try {
    const company = req.user.company;
    const role = req.user.role;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company or role missing from user data' });
    }

    // Fetch modules for company
    // Assuming your Module model schema has a 'roles' field which is an array of roles that can access the module
    // e.g. roles: ["admin", "superadmin"]
    // If you don't have this field, you may need to add it to support role-based filtering

    const modules = await Module.find({
      company,
      
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    console.error('Get modules by company and role error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
