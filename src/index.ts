import express, { Request, Response } from 'express';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const OAuth2Client = require('google-auth-library');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const secretkey = require('../config/secret.json');
const Login = require('../models/loginModel');
const { authenticateUser } = require('./controller/auth');

const app = express();
const cors = require('cors')
const port = process.env.PORT || 2115;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
}) 

app.post('login/user', async (req: Request, res: Response) => {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const authId: {} = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: authId,
            audience: process.env.CLIENT_ID
        });

        const { name, email, picture } = ticket.getPayload();

        const loginToken = jwt.sign(`${email}`, secretkey.key);

        await Login.findOneAndUpdate({
            email
        }, {
            name,
            picture
        }, {
            upsert: true
        });

        res.status(200).cookie('login', loginToken, { expires: new Date(360000 + Date.now()) }).send({
            success: true
        });
    }
    catch (e) {
        res.status(500).send({
            error: e
        });
    }
})

app.get('/logout/user', async (req: Request, res: Response) => {
    try {
        res.clearCookie('login').send({
            'success': true
        });
    }
    catch (e) {
        res.status(500).send({
            error: e
        });
    }
});

app.get('/user/checkLoginStatus', authenticateUser, async (req: Request, res: Response) => {
    try {
        res.status(200).send({
            'success': true
        });
    }
    catch (e) {
        res.status(500).send({
            error: e
        });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})