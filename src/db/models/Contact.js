import { Schema, model } from 'mongoose';

import { typeList } from '../../constants/contacts';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: String,
    isFavourite: {
      type: Boolean,
      default: false,
      required: true,
    },
    contactType: {
      type: String,
      enum: typeList,
      default: 'personal',
      required: true,
    },
  },
  { timestamps: true },
);

const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
