import { Request, Response } from 'express';
import { GoogleUser } from '../models';

export async function getFriendsForUser(req: Request, res: Response) {
    try {
        let user = await GoogleUser.findById(res.locals.user);
        if (!user) {
            console.log(`User with ID ${res.locals.user} not found.`);
            return res.status(404).send();
        }
        console.log(user);
        return res.status(200).send(user.friends);
    } catch (e) {
        console.error(`Error fetching friends for user with ID ${res.locals.user}:`, e);
        return res.status(500).send();
    }
}

export async function addFriend(req: Request, res: Response) {
    try {
        let friend = await GoogleUser.updateOne({ 
                _id: res.locals.user
            }, {
                $push: { friends: req.params.friendId }
            });
        if (!friend) {
            console.log(`Friend with ID ${req.params.friendId} not added.`);
            return res.status(404).send();
        }
        console.log(friend);

        let user = await GoogleUser.updateOne({ 
                _id: req.params.friendId
            }, {
                $push: { friends: res.locals.user }
            });
        if (!user) {
            console.log(`Friend with ID ${res.locals.user} not added.`);
            return res.status(404).send();
        }
        console.log(user);

        return res.status(200).send();
    } catch (e) {
        console.error(`Error adding friend: ${req.params.friendId} for user with ID ${res.locals.user}:`, e);
        return res.status(500).send();
    }
}

export async function removeFriend(req: Request, res: Response) {
    try {
        let friend = await GoogleUser.updateOne({ 
                _id: res.locals.user
            }, {
                $pull: { friends: req.params.friendId }
            });
        if (!friend) {
            console.log(`Friend with ID ${req.params.friendId} not removed.`);
            return res.status(404).send();
        }
        console.log(friend);

        let user = await GoogleUser.updateOne({ 
                _id: req.params.friendId
            }, {
                $pull: { friends: res.locals.user }
            });
        if (!user) {
            console.log(`Friend with ID ${res.locals.user} not removed.`);
            return res.status(404).send();
        }
        console.log(user);

        return res.status(200).send();
    } catch (e) {
        console.error(`Error removing friend: ${req.params.friendId} for user with ID ${res.locals.user}:`, e);
        return res.status(500).send();
    }
}