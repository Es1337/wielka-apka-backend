const friendController = require('../controller/friends');
const friendRouter = require('express').Router();

friendRouter.get('/user', friendController.getFriendsForUser);
friendRouter.put('/:friendId', friendController.addFriend);
friendRouter.delete('/:friendId', friendController.removeFriend);

module.exports = friendRouter;