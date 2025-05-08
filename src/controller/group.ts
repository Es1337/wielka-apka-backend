import { Request, Response } from 'express';
import { Group } from '../models';
const { Types } = require('mongoose')

export async function getGroup(req: Request, res: Response) {
    try {
        console.log(req.params.id);
        let group = await Group.findById(req.params.id).populate('users'); 
        if (!group) {
            console.log(`Group with ID ${req.params.id} not found.`);
            return res.status(404).send();
        }
        return res.status(200).send(group);
    } catch (e) {
        console.error(`Error fetching group with ID ${req.params.id}:`, e);
        return res.status(500).send();
    }
}

export async function createGroup(req: Request, res: Response) {
    try {
        let group = await Group.create({
            "groupName": req.body.groupName,
            "users": [req.body.userId],
            "date": Date.now()
        })

        if (!group) {
            console.log(`Group not created.`);
            return res.status(500).send();
        }

        return res.status(200).send(group);
    } catch (e) {
        console.error(`Error during creating a group :`, e);
        return res.status(500).send();
    }
    
}

export async function deleteGroup(req: Request, res: Response) {
    try {
        console.log(`Delete group with id: ${req.params.id}`)
        await Group.findByIdAndDelete(req.params.id);

        return res.status(200).send();
    } catch (e) {
        console.error(`Error during deleting a group with id ${req.params.id}:`, e);
        return res.status(500).send();
    }
}

export async function updateGroupName(req: Request, res: Response) {
    try {
        console.log(`Updating group with id: ${req.params.id}`)

        let group = await Group.updateOne({ 
            "_id": new Types.ObjectId(req.params.id)
        }, {
            "groupName": req.body.groupName
        });

        if (!group) {
            console.log(`Group not updated.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error during updating a group with id ${req.params.id}:`, e);
        return res.status(500).send();
    }
}

export async function getGroupsForUser(req: Request, res: Response) {
    try {
        let groups = await Group.aggregate([
            {
                "$match": { users: new Types.ObjectId(res.locals.user) },
            }
        ]);
        if (!groups) {
            console.log(`Groups for user with ID ${res.locals.user} not found.`);
            return res.status(404).send();
        }
        console.log(groups);
        return res.status(200).send(groups);
    } catch (e) {
        console.error(`Error fetching groups for user with ID ${res.locals.user}:`, e);
        return res.status(500).send();
    }
}

export async function addUserToGroup(req: Request, res: Response) {
    try {
        let group = await Group.updateOne({ 
            _id: req.params.id
        }, {
            $push: { users: req.body.userId }
        });

        if (!group) {
            console.log(`Group to update with ID: ${req.params.id} not found.`);
            return res.status(404).send();
        }

        return res.status(200).send();
    } catch (e) {
        console.error(`Error updating group with ID: ${req.params.id} with user with ID ${req.body.userId}:`, e);
        return res.status(500).send();
    }
}

export async function removeUserFromGroup(req: Request, res: Response) {
    try {
        console.log(`req.params.id: ${req.params.id}; req.body.userId: ${req.body.userId}`)

        let group = await Group.updateOne({ 
            _id: req.params.id
        }, {
            $pull: { users: req.body.userId }
        });

        if (!group) {
            console.log(`Group to update with ID: ${req.params.id} not found.`);
            return res.status(404).send();
        }

        console.log(group);
        return res.status(200).send();
    } catch (e) {
        console.error(`Error removing user with ID ${req.body.userId} from group with ID: ${req.params.id}:`, e);
        return res.status(500).send();
    }
}
