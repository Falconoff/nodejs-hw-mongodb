import express from 'express';
import cors from 'cors';
// import { pinoHttp } from 'pino-http';
import dotenv from 'dotenv';

import contactsRouter from './routers/contacts.js';

dotenv.config();

export const setupServer = () => {
  const app = express();

  app.use(cors());
  // app.use(express.json());

  // app.use(
  //   pinoHttp({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.get('/', (req, res) => {
    res.send('<h1>Home page</h1>');
  });

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    // res.status(404).json({ message: `${req.url} Not found` });
    res.status(404).json({ message: `Not found` });
  });

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
