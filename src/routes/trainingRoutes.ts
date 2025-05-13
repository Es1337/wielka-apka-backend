const trainingController = require('../controller/training');
const trainingRouter = require('express').Router();

trainingRouter.get('', trainingController.getAllTrainingsForGroup);
trainingRouter.post('', trainingController.addTraining);
trainingRouter.put('/:trainingId', trainingController.updateTrainingName);
trainingRouter.delete('/:trainingId', trainingController.removeTraining);

trainingRouter.post('/:trainingId/exercise', trainingController.addTrainingExercise);
trainingRouter.put('/:trainingId/exercise/:exerciseId', trainingController.updateTrainingExerciseName);
trainingRouter.delete('/:trainingId/exercise/:exerciseId', trainingController.removeTrainingExercise);

module.exports = trainingRouter;