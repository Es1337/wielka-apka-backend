const trainingController = require('../controller/training');
const trainingRouter = require('express').Router();

trainingRouter.get('', trainingController.getAllTrainingsForGroup);
trainingRouter.post('', trainingController.addTraining);
trainingRouter.get('/:trainingId', trainingController.getTraining);
trainingRouter.patch('/:trainingId', trainingController.updateTrainingName);
trainingRouter.delete('/:trainingId', trainingController.removeTraining);

trainingRouter.post('/:trainingId/exercise', trainingController.addTrainingExercise);
trainingRouter.patch('/:trainingId/exercise/:exerciseId', trainingController.updateTrainingExerciseName);
trainingRouter.delete('/:trainingId/exercise/:exerciseId', trainingController.removeTrainingExercise);

trainingRouter.post('/:trainingId/exercise/:exerciseId/set', trainingController.addSetToExercise);
trainingRouter.put('/:trainingId/exercise/:exerciseId/set/:setId', trainingController.updateSetInExercise);
trainingRouter.delete('/:trainingId/exercise/:exerciseId/set/:setId', trainingController.removeSetFromExercise);

module.exports = trainingRouter;