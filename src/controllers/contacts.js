import * as contactServices from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  try {
    const contacts = await contactServices.getContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const getContactByIdController = async (req, res) => {
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
};
