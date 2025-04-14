import { NextFunction, Request, Response } from "express";

const jwt = require('jsonwebtoken');
const Login = require('../../models/loginModel');
const secretkey = require('../../config/secret.json');

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    let idToken = req.cookies['login'];

    try {
        const decodedMessage = jwt.verify(idToken, secretkey.key);
        await Login.findOne({
            email: decodedMessage
        });
        next();
    }
    catch (e) {
        res.status(401).send({
            error: e
        })
    }
}

module.exports = { authenticateUser };