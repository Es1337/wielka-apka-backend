import { Request, Response } from 'express';
import { Training, Set } from '../models';
import { populate } from 'dotenv';
const { Types } = require('mongoose')

export async function getAllTrainingsForGroup(req: Request, res: Response) {
    try {
        let trainings = await Training.aggregate([
            {
                "$match": { group: new Types.ObjectId(req.groupId) },
            }
        ]);
        if (!trainings) {
            console.log(`Trainings for group with ID ${req.groupId} not found.`);
            return res.status(404).send();
        }
        console.log(trainings);
        return res.status(200).send(trainings);
    } catch (e) {
        console.error(`Error fetching trainings for group with ID ${req.groupId}:`, e);
        return res.status(500).send();
    }
}

export async function getTraining(req: Request, res: Response) {
    try {
        const training = await Training.findById(req.params.trainingId)
            .populate({ 
                path: 'exercises.series.sets',
                populate: {path: 'user'}
            });

        if (!training) {
            console.log(`Training with ID ${req.params.trainingId} not found.`);
            return res.status(404).send();
        }

        return res.status(200).send(training);
    } catch (e) {
        console.error(`Error fetching training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

export async function addTraining(req: Request, res: Response) {
    try {
        let training = await Training.create({
            "group": new Types.ObjectId(req.groupId),
            "trainingName": req.body.trainingName,
            "date": req.body.date,
            "exercises": []
        });

        console.log(training);
        return res.status(200).send(training);
    } catch (e) {
        console.error(`Error adding training for group with ID ${req.groupId}:`, e);
        return res.status(500).send();
    }
}

export async function removeTraining(req: Request, res: Response) {
    try {
        let training = await Training.findByIdAndDelete(req.params.trainingId);

        console.log(training);
        return res.status(200).send();
    } catch (e) {
        console.error(`Error removing training for group with ID ${req.groupId}:`, e);
        return res.status(500).send();
    }
}

export async function updateTraining(req: Request, res: Response) {
    try {
        console.log(`Updating training with id: ${req.params.trainingId}`)
        console.log(req.body.trainingName);

        let training = await Training.updateOne({ 
            "_id": new Types.ObjectId(req.params.trainingId)
        }, {
            "name": req.body.trainingName,
            "date": req.body.date || Date.now()
        });

        if (!training) {
            console.log(`Training not updated.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error during updating training with id ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

type ExerciseType = {
    name: string;
    sets: Array<{
        user: string;
        weight: number;
        reps: number;
    }>;
};

export async function getTrainingExercise(req: Request, res: Response) {
    try {
        let training = await Training.findById(req.params.trainingId);

        if (!training) {
            console.log(`Training not found.`);
            return res.status(404).send();
        }

        let exercise = training.exercises.filter((exercise: ExerciseType) => exercise.name === req.params.exerciseName);
        if (!exercise) {
            console.log(`Exercise with name ${req.params.exerciseName} not found in training with ID ${req.params.trainingId}.`);
            return res.status(404).send();
        }

        return res.status(200).send(exercise);
    } catch (e) {
        console.error(`Error fetching training with ID ${req.params.trainingId}:`, e);        
        return res.status(500).send();
    }
}

export async function addTrainingExercise(req: Request, res: Response) {
    try {
        let training = await Training.updateOne({ 
            "_id": new Types.ObjectId(req.params.trainingId)
        }, {
            "$push": { exercises: { name: req.body.exerciseName } }
        });

        if (!training) {
            console.log(`Training not updated.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error during updating training with id ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

export async function removeTrainingExercise(req: Request, res: Response) {
    try {
        console.log('delete');
        let training = await Training.updateOne({ 
            "_id": new Types.ObjectId(req.params.trainingId)
        }, {
            "$pull": { exercises: { _id: req.params.exerciseId } }
        });

        if (!training) {
            console.log(`Training not updated.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error during updating training with id ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

export async function updateTrainingExerciseName(req: Request, res: Response) {
    try {
        let training = await Training.updateOne({ 
            "_id": new Types.ObjectId(req.params.trainingId),
            "exercises._id": new Types.ObjectId(req.params.exerciseId)
        }, {
            "$set": { "exercises.$.name": req.body.exerciseName }
        });

        console.log(training);

        if (!training) {
            console.log(`Training not updated.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error during updating training with id ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

// Get all series for an exercise
export async function getExerciseSeries(req: Request, res: Response) {
    try {
        const training = await Training.findById(req.params.trainingId);
        if (!training) {
            console.log(`Training not found.`);
            return res.status(404).send();
        }

        const exercise = training.exercises.id(req.params.exerciseId);
        if (!exercise) {
            console.log(`Exercise with ID ${req.params.exerciseId} not found in training with ID ${req.params.trainingId}.`);
            return res.status(404).send();
        }

        return res.status(200).send(exercise.series);
    } catch (e) {
        console.error(`Error fetching series:`, e);
        return res.status(500).send();
    }
}

// Get a single series by ID
export async function getExerciseSeriesById(req: Request, res: Response) {
    try {
        const training = await Training.findById(req.params.trainingId);
        if (!training) {
            console.log(`Training not found.`);
            return res.status(404).send();
        }

        const exercise = training.exercises.id(req.params.exerciseId);
        if (!exercise) {
            console.log(`Exercise with ID ${req.params.exerciseId} not found in training with ID ${req.params.trainingId}.`);
            return res.status(404).send();
        }

        const series = exercise.series.id(req.params.seriesId);
        if (!series) {
            console.log(`Series with ID ${req.params.seriesId} not found in exercise with ID ${req.params.exerciseId}.`);
            return res.status(404).send();
        }

        return res.status(200).send(series);
    } catch (e) {
        console.error(`Error fetching series by id:`, e);
        return res.status(500).send();
    }
}

// Add a new series to an exercise
export async function addSeriesToExercise(req: Request, res: Response) {
    try {
        const training = await Training.findById(req.params.trainingId);
        if (!training) {
            console.log(`Training not found.`);
            return res.status(404).send();
        }

        const exercise = training.exercises.id(req.params.exerciseId);
        if (!exercise) {
            console.log(`Exercise with ID ${req.params.exerciseId} not found in training with ID ${req.params.trainingId}.`);
            return res.status(404).send();
        }

        exercise.series.push({ sets: [] });
        await training.save();

        return res.status(200).send(exercise.series[exercise.series.length - 1]);
    } catch (e) {
        console.error(`Error adding series:`, e);
        return res.status(500).send();
    }
}

export async function addSetToExercise(req: Request, res: Response) {
    try {
        const training = await Training.findById(req.params.trainingId);
        if (!training) {
            console.log(`Training not found.`);
            return res.status(404).send();
        }

        const exercise = training.exercises.id(req.params.exerciseId);
        if (!exercise) {
            console.log(`Exercise with ID ${req.params.exerciseId} not found in training with ID ${req.params.trainingId}.`);
            return res.status(404).send();
        }

        // Find the correct series
        const series = exercise.series[0];
        if (!series) {
            console.log(`Series in exercise with ID ${req.params.exerciseId}.`);
            return res.status(404).send();
        }

        let newSet = await Set.create(
            req.body.set
        );

        series.sets.push(newSet._id);
        await training.save();

        return res.status(200).send(series.sets[series.sets.length - 1]);
    } catch (e) {
        console.error(`Error adding set to series in exercise in training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

export async function removeSetFromExercise(req: Request, res: Response) {
    try {
        const training = await Training.findById(req.params.trainingId);
        if (!training) {
            console.log(`Training not found.`);
            return res.status(404).send();
        }

        const exercise = training.exercises.id(req.params.exerciseId);
        if (!exercise) {
            console.log(`Exercise with ID ${req.params.exerciseId} not found in training with ID ${req.params.trainingId}.`);
            return res.status(404).send();
        }

        const series = exercise.series[0];
        if (!series) {
            console.log(`Series not found in exercise with ID ${req.params.exerciseId}.`);
            return res.status(404).send();
        }

        const set = series.sets.id(req.params.setId);
        if (!set) {
            console.log(`Set with ID ${req.params.setId} not found in series with ID ${req.params.seriesId}.`);
            return res.status(404).send();
        }

        set.remove();
        await training.save();

        return res.status(200).send();
    } catch (e) {
        console.error(`Error removing set from series in exercise in training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

export async function updateSetInExercise(req: Request, res: Response) {
    try {
        const training = await Training.findById(req.params.trainingId);
        if (!training) {
            console.log(`Training not found.`);
            return res.status(404).send();
        }

        const exercise = training.exercises.id(req.params.exerciseId);
        if (!exercise) {
            console.log(`Exercise with ID ${req.params.exerciseId} not found in training with ID ${req.params.trainingId}.`);
            return res.status(404).send();
        }

        const series = exercise.series[0];
        if (!series) {
            console.log(`Series in exercise with ID ${req.params.exerciseId}.`);
            return res.status(404).send();
        }

        const set = series.sets.id(req.params.setId);
        if (!set) {
            console.log(`Set with ID ${req.params.setId} not found in series with ID ${req.params.seriesId}.`);
            return res.status(404).send();
        }

        Object.assign(set, req.body.set);
        await training.save();

        return res.status(200).send(set);
    } catch (e) {
        console.error(`Error updating set in series in exercise in training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}