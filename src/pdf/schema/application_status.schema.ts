import { Schema } from 'dynamoose';

export const ApplicantionStatusSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});