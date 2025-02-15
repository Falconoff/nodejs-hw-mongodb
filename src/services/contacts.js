import ContactCollection from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 5,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;

  const contactsQuery = ContactCollection.find();

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }

  /*
  const data = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  // загальна кількість записів
  const totalItems = await ContactCollection.find()
    .merge(contactsQuery)
    .countDocuments();
*/

  /*Цей рефакторинг коду використовує підхід паралельної обробки запитів до бази даних за допомогою Promise.all, що дозволяє ефективніше використовувати ресурси і скоротити час відповіді сервера*/
  const [totalItems, data] = await Promise.all([
    ContactCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calcPaginationData({ totalItems, page, perPage });

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData, //totalPages, hasNextPage, hasPrevPage,
  };
};

// export const getContactById = (id) => ContactCollection.findById(id);
export const getContactById = (filter) => ContactCollection.findOne(filter);

export const createContact = async (payload) => {
  const newContact = ContactCollection.create(payload);
  return newContact;
};

export const updateContact = async (filter, payload, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(filter, payload, {
    includeResultMetadata: true,
    runValidators: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = (filter) => {
  const deletedContact = ContactCollection.findOneAndDelete(filter);
  return deletedContact;
};
