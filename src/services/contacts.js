import ContactCollection from '../db/models/Contact.js';

export const getContacts = () => ContactCollection.find();

export const getContactById = (id) => ContactCollection.findById(id);

export const createContact = async (payload) => {
  const newContact = ContactCollection.create(payload);
  return newContact;
};

export const updateContact = async (id, payload, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: id },
    payload,
    {
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = (id) => {
  const deletedContact = ContactCollection.findOneAndDelete({ _id: id });
  return deletedContact;
};
