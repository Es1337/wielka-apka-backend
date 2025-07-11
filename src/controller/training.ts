import { Request, Response } from 'express';
import { Training, Exercise, Group } from '../models';
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

        await Training.populate(trainings, {path: 'exercises'});
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
                path: 'exercises'
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

export async function addTrainingWithExercises(req: Request, res: Response) {
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

        training.exercises.forEach(async (exerciseId: string) => {
            await Exercise.findByIdAndDelete(exerciseId);
        });

        console.log(training);
        return res.status(200).send(training);
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
    _id: string;
    name: string;
    user: string;
    sets: Array<{
        weight: number;
        reps: number;
        count: number;
    }>;
    date: Date;
};

type SetType = {
    _id: string;
    weight: number;
    reps: number;
    count: number;
}

export async function getTrainingExercise(req: Request, res: Response) {
    try {
        let training = await Training.findById(req.params.trainingId).populate({
            path: 'exercises'
        });

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
        let group = await Group.findById(req.groupId);
        let newExercises: ExerciseType[] = [];

        for (let userId of group.users) {

            let exercise = await Exercise.create({
                "name": req.body.exerciseName,
                "user": new Types.ObjectId(userId),
                "date": req.body.date || Date.now(),
                "sets": []
            });

            if (!exercise) {
                console.log(`Exercise ${req.body.exerciseName} not created.`);
                return res.status(500).send();
            }

            let training = await Training.updateOne({
                "_id": new Types.ObjectId(req.params.trainingId)
            }, {
                "$push": { exercises: exercise._id }
            });

            if (!training) {
                console.log(`Training ${req.params.trainingId} not updated.`);
                return res.status(404).send();
            }

            newExercises.push(exercise);
        }

        return res.status(200).send(newExercises);
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
            "$pull": { exercises: req.params.exerciseId }
        });

        if (!training) {
            console.log(`Training not updated.`);
            return res.status(404).send();
        }

        let exercise = await Exercise.findByIdAndDelete(req.params.exerciseId);
        if (!exercise) {
            console.log(`Exercise not deleted.`);
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
        let exercise = await Exercise.updateOne({
            "_id": new Types.ObjectId(req.params.exerciseId)
        }, {
            "name": req.body.exerciseName
        });

        console.log(exercise);

        if (!exercise) {
            console.log(`Exercise not updated.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error during updating exercise with id ${req.params.exerciseId}:`, e);
        return res.status(500).send();
    }
}

export async function addSetToExercise(req: Request, res: Response) {
    try {
        const newSet = {
            weight: req.body.set.weight,
            reps: req.body.set.reps,
            count: req.body.set.count || (await Exercise.findOne({ "_id": new Types.ObjectId(req.params.exerciseId) })).sets.length + 1
        }
        const exercise = await Exercise.updateOne(
            { "_id": new Types.ObjectId(req.params.exerciseId) },
            {
                "$push": {
                    sets: newSet
                }
            }
        );

        if (!exercise) {
            console.log(`Exercise with ID ${req.params.exerciseId} could not be updated with new set.`);
            return res.status(404).send();
        }

        return res.status(200).send(newSet);
    } catch (e) {
        console.error(`Error adding set to exercise in training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

export async function removeSetFromExercise(req: Request, res: Response) {
    try {
        const exercise = await Exercise.findOneAndUpdate(
            { "_id": new Types.ObjectId(req.params.exerciseId) },
            { "$pull": { sets: { count: req.params.count } } },
            { new: true }
        );
        
        if (!exercise) {
            console.log(`Exercise with ID ${req.params.exerciseId} not found or couldn't remove set.`);
            return res.status(404).send();
        }

        let newCount = 1;
        // Re-number set counts after removal
        if (exercise && Array.isArray((exercise as any).sets)) {
            for (const set of (exercise as any).sets) {
                set.count = newCount++;
            }
        }

        await exercise.save();

        return res.status(200).send();
    } catch (e) {
        console.error(`Error removing set from exercise in training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}

export async function updateSetInExercise(req: Request, res: Response) {
    try {
        const { exerciseId } = req.params;
        let { count, weight, reps } = req.body.set;

        // TODO: Support for updating set count
        // TODO: Make set count a computed field in the database
        if (!count) {
            count = req.params.count;
        }

        // Find the exercise
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            console.log(`Exercise with ID ${exerciseId} not found.`);
            return res.status(404).send();
        }
        
        // Find the set by count
        const setIndex = exercise.sets.findIndex((s: SetType) => 
            s.count.toString() === count as string);
        if (setIndex === -1) {
            console.log(`Set with count ${count} not found in exercise ${exerciseId}.`);
            return res.status(404).send();
        }

        // Update set fields
        if (weight !== undefined) exercise.sets[setIndex].weight = weight;
        if (reps !== undefined) exercise.sets[setIndex].reps = reps;

        await exercise.save();

        const set = exercise.sets[setIndex];
        return res.status(200).send(set);
    } catch (e) {
        console.error(`Error updating set in exercise in training with ID ${req.params.trainingId}:`, e);
        return res.status(500).send();
    }
}