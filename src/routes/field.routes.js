const express = require('express');
const router = express.Router();
const FieldController = require('../controllers/field.controller');

// Add field to a module
router.post('/:moduleId/fields', FieldController.addField);

router.get('/:moduleId/fields/:fieldId', FieldController.getFieldById);
router.put('/:moduleId/fields/:fieldId', FieldController.updateFieldById);
router.delete('/:moduleId/fields/:fieldId', FieldController.deleteFieldById);

// Get all fields of a module
router.get('/:moduleId/fields', FieldController.getFields);

module.exports = router;
