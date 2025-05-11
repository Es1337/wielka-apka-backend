const trainingController = require('../controller/training');
const trainingRouter = require('express').Router();

trainingRouter.get('', trainingController.getAllTrainingsForGroup);

module.exports = trainingRouter;