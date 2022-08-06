import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createStuffRouter } from './routes/new';
import { showStuffRouter } from './routes/show';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@morelcorp_learn/common';
import { indexStuffRouter } from './routes/index';
import { updateStuffRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(showStuffRouter);
app.use(createStuffRouter);
app.use(indexStuffRouter);
app.use(updateStuffRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
