import { Schema, model } from 'dynamoose';


export interface UserKey {
  email: string; 
}

export interface User extends UserKey  {
  password: string;
}

export const UserSchema = new Schema({
  email: {
    type: String,
    hashKey: true, // Partition key
  },
  password: {
    type: String,
    required: true,
  },
});
