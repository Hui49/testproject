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

 export interface ResumeKey {
    id: string; 
  }
  
  //todo : skill
  export interface Resume extends ResumeKey {
    name: string;
    email: string;
    mobile: string;
    address: string;
    educations: Education[];
    profession_experiences: ProfessionExperience[];
    state: ApplicationState;
  }