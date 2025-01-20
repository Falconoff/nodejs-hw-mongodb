import { Router } from 'express';

// import * as contactServices from '../services/contacts.js';
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/', getContactsController);

contactsRouter.get('/:id', getContactByIdController);

export default contactsRouter;
