import { Router } from 'express';

// import * as contactServices from '../services/contacts.js';
import {
  getContactsController,
  getContactByIdController,
  addContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:id', ctrlWrapper(getContactByIdController));

contactsRouter.post('/', ctrlWrapper(addContactController));

export default contactsRouter;
