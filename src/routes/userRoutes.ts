const userController = require('../controller/user');
const userRouter = require('express').Router();

userRouter.get('/profile', userController.getUserProfile);

module.exports = userRouter;