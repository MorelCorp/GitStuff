import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@morelcorp_learn/common';
import { User } from '../models/user';
import { Password } from '../services/passwords';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .notEmpty()
      .trim()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    // generate the JWT and store it on session object
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };
    console.log('Successful signin by ', existingUser.email);
    console.log('Cookie ', req.session);

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
