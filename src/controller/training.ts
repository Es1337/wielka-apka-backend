import { Request, Response } from 'express';
import { Training } from '../models';
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
        const training = await Training.findById(req.params.trainingId).populate('exercises.sets.user');

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

export async function addSetToExercise(req: Request, res: Response) {
    try {
        const training = await Training.updateOne(
            {
                "_id": new Types.ObjectId(req.params.trainingId),
                "exercises._id": new Types.ObjectId(req.params.exerciseId)
            },
            {
                "$push": { "exercises.$.sets": req.body.set }
            }
        );

        if (!training) {
            console.log(`Training or exercise not found.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error adding set to exercise in training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

export async function removeSetFromExercise(req: Request, res: Response) {
    try {
        const training = await Training.updateOne(
            {
                "_id": new Types.ObjectId(req.params.trainingId),
                "exercises._id": new Types.ObjectId(req.params.exerciseId)
            },
            {
                "$pull": { "exercises.$.sets": { "_id": new Types.ObjectId(req.params.setId) } }
            }
        );

        if (!training) {
            console.log(`Training, exercise, or set not found.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error removing set from exercise in training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

export async function updateSetInExercise(req: Request, res: Response) {
    try {
        const training = await Training.updateOne(
            {
                "_id": new Types.ObjectId(req.params.trainingId),
                "exercises._id": new Types.ObjectId(req.params.exerciseId),
                "exercises.sets._id": new Types.ObjectId(req.params.setId)
            },
            {
                "$set": {
                    "exercises.$[exercise].sets.$[set]": req.body.set
                }
            },
            {
                arrayFilters: [
                    { "exercise._id": new Types.ObjectId(req.params.exerciseId) },
                    { "set._id": new Types.ObjectId(req.params.setId) }
                ]
            }
        );

        if (!training) {
            console.log(`Training, exercise, or set not found.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error updating set in exercise in training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}