const express = require('express');
const {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule,
  getModulesByCompanyAndRole,  // import the new function
} = require('../controllers/module.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // protect all routes

router.post('/', createModule);
router.get('/', getModules);
router.get('/byRole', getModulesByCompanyAndRole);  // new route to filter by company & role
router.get('/:id', getModuleById);
router.put('/:id', updateModule);
router.delete('/:id', deleteModule);

module.exports = router;
