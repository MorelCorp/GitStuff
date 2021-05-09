import express from 'express';

import { currentUser } from '@morelcorp_learn/common';

const router = express.Router();

console.log('currentuser called for ', currentUser);

router.get('/api/users/currentuser', currentUser, (req, res) => {
  console.log('currentUser called by: ', req.currentUser || null);

  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
