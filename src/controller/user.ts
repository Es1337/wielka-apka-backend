import { Request, Response } from "express";
import { GoogleUser } from "../models";

export async function getUserProfile(req: Request, res: Response) {
    try {
        const userId = res.locals.user;
        const user = await GoogleUser.findById(userId);

        if (!user) {
            console.log(`User with ID ${userId} not found.`);
            return res.status(404).send();
        }

        return res.status(200).send({
            name: user.name,
            email: user.email,
            picture: user.picture
        });

    } catch (e) {
        console.error(`Error fetching user profile for ID ${res.locals.user}:`, e);
        return res.status(500).send();
    }
}