import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import dotenv from 'dotenv';

import * as contactServices from './services/contacts.js';

dotenv.config();
console.log(process.env.PORT);

export const setupServer = () => {
  const app = express();

  app.use(cors());
  // app.use(express.json());

  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.send('<h1>Home page</h1>');
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await contactServices.getContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const contact = await contactServices.getContactById(id);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  });

  app.use((req, res) => {
    // res.status(404).json({ message: `${req.url} Not found` });
    res.status(404).json({ message: `Not found` });
  });

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
