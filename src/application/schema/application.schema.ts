import { Schema } from 'dynamoose';
import { Education } from '../interface/application.interface';

const Education = new Schema({
  degree_name: String,
  university_name: String,
  graduation_year: String,
});

const ProfessionExperiences = new Schema({
  start_time: String,
  end_time: String,
  job_title: String,
  company: String,
  job_summary: String,
});

export const ApplicationSchema = new Schema({
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
  mobile: {
    type: String,
  },
  address: {
    type: String,
  },
  educations: {
    type: Array,
    schema: [Education],
    default: [],
  },
  profession_experiences: {
    type: Array,
    schema: [ProfessionExperiences],
    default: [],
  },
  skills: {
    type: Array,
    schema: [String],
    default: [],
  },
  state: {
    type: String,
    required: true,
  },
});

export default ApplicationSchema;
