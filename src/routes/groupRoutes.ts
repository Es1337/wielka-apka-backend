const groupController = require('../controller/group');
const groupRouter = require('express').Router();

groupRouter.get('/user', groupController.getGroupsForUser);
groupRouter.post('/:id/user', groupController.addUserToGroup);
groupRouter.delete('/:id/user', groupController.removeUserFromGroup);

groupRouter.get('/:id', groupController.getGroup);
groupRouter.put('/:id', groupController.updateGroupName);
groupRouter.delete('/:id', groupController.deleteGroup);
groupRouter.post('/', groupController.createGroup);

module.exports = groupRouter;