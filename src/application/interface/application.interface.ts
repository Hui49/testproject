export enum ApplicationState {
  NEW = 'New',
  UNDER_REVIEW = 'Under review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

interface PersonalInfo {
  name: string;
  email: string;
  mobile: string;
  address: string;
}

export interface Education {
  degree_name: string;
  university_name: string;
  graduation_year: string;
}

interface ProfessionExperience {
  start_time: string;
  end_time: string;
  job_title: string;
  company: string;
  job_summary: string;
}

 export interface ApplicationKey {
    id: string; 
  }
  
  //todo : skill
  export interface Application extends ApplicationKey {
    name: string;
    email: string;
    mobile: string;
    address: string;
    skills: string[];
    educations: Education[];
    profession_experiences: ProfessionExperience[];
    state: ApplicationState;
  }