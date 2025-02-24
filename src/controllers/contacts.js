import createError from 'http-errors';

import * as contactServices from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../constants/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseFilterParams(req.query);
  filter.userId = req.user._id;

  const contacts = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: _id } = req.params;

  const contact = await contactServices.getContactById({ _id, userId });

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}!`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  const isCloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE') === 'true';
  console.log('isCloudinaryEnable: ', isCloudinaryEnable);

  let photo;
  if (req.file) {
    if (isCloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadsDir(req.file);
    }
  }

  const { _id: userId } = req.user;
  const newContact = await contactServices.createContact({
    ...req.body,
    photo,
    userId,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;

  const isCloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE') === 'true';
  console.log('isCloudinaryEnable: ', isCloudinaryEnable);

  let photo;
  if (req.file) {
    if (isCloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadsDir(req.file);
    }
  }

  const result = await contactServices.updateContact(
    { _id, userId },
    {
      ...req.body,
      photo,
      userId,
    },
  );
  console.log('result: ', result);

  if (!result) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;

  const deletedContact = await contactServices.deleteContact({ _id, userId });

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
