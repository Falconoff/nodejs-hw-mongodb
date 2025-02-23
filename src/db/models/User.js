import { Schema, model } from 'mongoose';

import { emailRegexp } from '../../constants/users.js';
// import { handleSaveError } from './hooks.js';
// import { handleSaveError, setUpdateSettings } from './hooks.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// userSchema.post('save', handleSaveError);

// userSchema.pre('findOneAndUpdate', setUpdateSettings);

// userSchema.post('findOneAndUpdate', handleSaveError);

// відповідь на роуті POST будемо повертати без паролю
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UsersCollection = model('user', userSchema);

export default UsersCollection;
