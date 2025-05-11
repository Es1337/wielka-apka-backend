import { NextFunction, Request, Response } from "express";

const groupController = require('../controller/group');
const groupRouter = require('express').Router();
const trainingRoutes = require('./trainingRoutes')

const saveGroupId = (req: Request, res: Response, next: NextFunction) => {
    req.groupId = req.params.groupId;
    next();
}

groupRouter.get('/user', groupController.getGroupsForUser);
groupRouter.post('/:groupId/user', groupController.addUserToGroup);
groupRouter.delete('/:groupId/user', groupController.removeUserFromGroup);

groupRouter.get('/:groupId', groupController.getGroup);
groupRouter.put('/:groupId', groupController.updateGroupName);
groupRouter.delete('/:groupId', groupController.deleteGroup);
groupRouter.post('/', groupController.createGroup);

groupRouter.use('/:groupId/training', saveGroupId, trainingRoutes);

module.exports = groupRouter;