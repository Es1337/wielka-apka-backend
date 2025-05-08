import { NextFunction, Request, Response } from "express";
import { GoogleUser } from '../models';

const jwt = require('jsonwebtoken');
const secretkey = require('../../config/secret.json');

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    let idToken = req.cookies['login'];
    
    try {
        const decodedMessage = jwt.verify(idToken, secretkey.key);
        const user = await GoogleUser.findOne({
            email: decodedMessage
        });
        res.locals.user = user._id.toString();
        console.log("res.locals.user: ", res.locals.user);
        next();
    }
    catch (e) {
        console.error("Mongo fetch error")
        console.log(e);
        res.status(401).send({
            error: e
        })
    }
}

module.exports = { authenticateUser };