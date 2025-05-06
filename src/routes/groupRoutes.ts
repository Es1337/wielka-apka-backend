const controller = require('../controller/group');
const router = require('express').Router();

router.get('/user', controller.getGroupsForUser);
router.get('/:id', controller.getGroup);
router.put('/:id', controller.updateGroupName);
router.delete('/:id', controller.deleteGroup);
router.post('/', controller.createGroup);

module.exports = router;