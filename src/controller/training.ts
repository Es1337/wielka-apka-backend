import { Request, Response } from 'express';
import { Training } from '../models';
const { Types } = require('mongoose')

export async function getAllTrainingsForGroup(req: Request, res: Response) {
    try {
        console.log(req.groupId);
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