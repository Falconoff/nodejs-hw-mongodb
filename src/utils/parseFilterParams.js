import { typeList } from '../constants/contacts.js';

const parseIsFavourite = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;

  const isBoolean = ['true', 'false'].includes(value);
  if (isBoolean) return value === 'true';
};

const parseContactType = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;

  const isContactType = typeList.includes(value);
  if (isContactType) return value;
};

export const parseFilterParams = ({ isFavourite, contactType }) => {
  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedContactType = parseContactType(contactType);

  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedContactType,
  };
};
