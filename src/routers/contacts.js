import { Router } from 'express';

// import * as contactServices from '../services/contacts.js';
import {
  getContactsController,
  getContactByIdController,
  addContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:id', ctrlWrapper(getContactByIdController));

contactsRouter.post('/', ctrlWrapper(addContactController));

contactsRouter.patch('/:id', ctrlWrapper(patchContactController));

contactsRouter.delete('/:id', ctrlWrapper(deleteContactController));

export default contactsRouter;
