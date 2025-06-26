const trainingController = require('../controller/training');
const trainingRouter = require('express').Router();

trainingRouter.get('', trainingController.getAllTrainingsForGroup);
trainingRouter.post('', trainingController.addTraining);
trainingRouter.get('/:trainingId', trainingController.getTraining);
trainingRouter.patch('/:trainingId', trainingController.updateTraining);
trainingRouter.delete('/:trainingId', trainingController.removeTraining);

trainingRouter.get('/:trainingId/exercise/:exerciseName', trainingController.getTrainingExercise);
trainingRouter.post('/:trainingId/exercise', trainingController.addTrainingExercise);
trainingRouter.patch('/:trainingId/exercise/:exerciseId', trainingController.updateTrainingExerciseName);
trainingRouter.delete('/:trainingId/exercise/:exerciseId', trainingController.removeTrainingExercise);

trainingRouter.get('/:trainingId/exercise/:exerciseId/series', trainingController.getExerciseSeries);
trainingRouter.get('/:trainingId/exercise/:exerciseId/series/:seriesId', trainingController.getExerciseSeriesById);
trainingRouter.post('/:trainingId/exercise/:exerciseId/series', trainingController.addSeriesToExercise);

trainingRouter.post('/:trainingId/exercise/:exerciseId/series/set', trainingController.addSetToExercise);
trainingRouter.put('/:trainingId/exercise/:exerciseId/series/set/:setId', trainingController.updateSetInExercise);
trainingRouter.delete('/:trainingId/exercise/:exerciseId/series/set/:setId', trainingController.removeSetFromExercise);

module.exports = trainingRouter;