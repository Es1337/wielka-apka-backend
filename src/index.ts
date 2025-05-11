import { CorsOptions } from 'cors';
import express, { Request, Response } from 'express';
const routes = require('./routes')

require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const secretkey = require('../config/secret.json');
const { GoogleUser } = require('./models/userModel');
const { authenticateUser } = require('./controller/auth');
const cors = require('cors')
const morgan = require('morgan');

const PORT = process.env.PORT || 2115;
const ALLOWED_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173"]
const CORS_OPTIONS: CorsOptions = {
    origin: function (origin: string | undefined, callback: CallableFunction) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    },
    credentials: true
};

const app = express();
app.use(morgan('tiny'));
app.use(cors(CORS_OPTIONS));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

declare module "express-serve-static-core" {
    interface Request {
      groupId?: String;
    }
  }

app.post('/login/user', async (req: Request, res: Response) => {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const authId: {} = req.body.authId;
    try {
        const ticket = await client.verifyIdToken({
            idToken: authId,
            audience: process.env.CLIENT_ID
        });
        
        const { name, email, picture } = ticket.getPayload();
        const loginToken = jwt.sign(`${email}`, secretkey.key);
        await GoogleUser.findOneAndUpdate({
            email
        }, {
            name,
            picture
        }, {
            upsert: true
        });
        res.status(200).cookie('login', loginToken, { sameSite: "none", secure: true, expires: new Date(36000000 + Date.now()) }).send({
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

app.use('/group', authenticateUser, routes.groupRoutes);
app.use('/friend', authenticateUser, routes.friendRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
})