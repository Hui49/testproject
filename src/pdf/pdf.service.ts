import { Injectable,Logger, NotFoundException } from '@nestjs/common';
import * as PDFParser from 'pdf-parse';
import { File } from './interface/file.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import axios from 'axios';
import { ApplicationState, Resume, ResumeKey } from './resume.interface';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class PdfService {
  constructor(
    @InjectModel('Resume')
    private resumeModel: Model<Resume, ResumeKey>,
  ) {}
  private readonly logger = new Logger(PdfService.name);
  
  async queryOpenAI(prompt: string): Promise<any> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {"role": "user",
             "content": prompt
             }
            ],
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer sk-proj-ho04lLbOZFVLE37LymZyT3BlbkFJMiPxFN4OZdvbNR3ravoN`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data['choices'][0].message.content;
    } catch (error) {
      this.logger.error(`Error querying OpenAI: ${error.message}`);
      throw new Error('Failed to query OpenAI');
    }
  }

  async parseResume(pdfFile: File): Promise<any> {
    const pdfData = await PDFParser(pdfFile.buffer);
    const prompt = this.getPrompt(pdfData.text);
    const responseText = await this.queryOpenAI(`${prompt}`);
    const resumeData = JSON.parse(responseText);
    await this.saveResumeFromJson(resumeData);
    return JSON.parse(responseText);
  }

  private getPrompt(message: string): string {
  return `Please retrieve name,email_id,mob_number, address, educations ( with degree_name, university_name, graduation_year), profession_experiences (with start_time, end_time, job_title, company, job_summary), skills from the following resume article. the educations and profession_experiences field should contain array of json body and skills should contain array as well.  If you can't find the information from this article then return "" or empty array.   Do not make things up. Always return your response as a valid JSON string. The format of that string should be this,
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile": "123-456-7890",
    "address": "123 Main Street, City, Country",
    "educations": [
      {
        "degree_name": "Bachelor of Science in Computer Science",
        "university_name": "University of Example",
        "graduation_year": "2020"
      },
      {
        "degree_name": "Master of Business Administration",
        "university_name": "Business School",
        "graduation_year": "2022"
      }
    ],
    "profession_experiences": [
      {
        "start_time": "2018",
        "end_time": "2020",
        "job_title": "Software Engineer",
        "company": "Tech Company",
        "job_summary": "Developed web applications using React.js and Node.js."
      },
      {
        "start_time": "2020",
        "end_time": "2022",
        "job_title": "Product Manager",
        "company": "Product Company",
        "job_summary": "Led product development team and managed product roadmap."
      }
    ],
    "skills": [
      "JavaScript",
      "React.js",
      "Node.js",
      "Product Management",
      "Team Leadership"
    ]
  }
           News Article:
           ============
           ${message}`;
  }

  async saveResumeFromJson(jsonData: any){
    // Assuming jsonData contains the relevant fields for the resume
    const { v4: uuidv4 } = require('uuid');
    // todo: if field is not existed in the jsondata
    const resumeData: Resume = {
      id: uuidv4(),
      name: jsonData.name,
      mobile: jsonData.mobile,
      address: jsonData.address,
      email: jsonData.email,
      state: ApplicationState.NEW,
      educations: jsonData.educations,
      profession_experiences: jsonData.profession_experiences
    };
    await this.resumeModel.create(resumeData)
  }

  async getAllApplicants(): Promise<Resume[]> {
    try {
      const resumes = await this.resumeModel.scan().exec();
      return resumes;
    } catch (error) {
      throw new Error(`Failed to retrieve applicants from DynamoDB: ${error.message}`);
    }
  }  

  async getApplicationById(applicationId: string): Promise<Resume> {

    try {
      const resumeData = await this.resumeModel.get({ id: applicationId });
      // todo: handle undefined from get 
      return resumeData;
    } catch (error) {
      console.error('Error querying resume data:', error);
    }    
   }

  async updateApplication(id: string, updateDto: UpdateApplicationDto): Promise<Resume> {
    
    const existingResume = await this.getApplicationById(id); // Pass an object with the primary key attribute(s)
    if (!existingResume) {
      throw new NotFoundException('Resume not found');
    }

    const updatedResume: Resume = {
      ...existingResume, 
      ...updateDto,     
      id,              
    };
  
  try {
    await this.resumeModel.update(updatedResume);
    return updatedResume;
  } catch (error) {
    throw new Error(`Failed to update applicants from DynamoDB: ${error.message}`);
  } 
  }

  async searchApplications(criteria: { fullName?: string, address?: string, phoneNumber?: string, email?: string, skills?: string }): Promise<Resume[]> {
    const queryConditions: any = {};

    if (criteria.fullName) {
      queryConditions.name = { contains: criteria.fullName };
    }
    if (criteria.address) {
      queryConditions.address = { contains: criteria.address };
    }
    if (criteria.phoneNumber) {
      queryConditions.mobile = { contains: criteria.phoneNumber };
    }
    if (criteria.email) {
      queryConditions.email = { contains: criteria.email };
    }
    if (criteria.skills) {
      queryConditions.skills = { contains: criteria.skills };
    }
    return this.resumeModel.scan(queryConditions).exec();
  } 

  async updateApplicationState(id: string, newState: ApplicationState): Promise<Resume> {
    const existingApplication = await this.getApplicationById(id);
    if (!existingApplication) {
      throw new NotFoundException('Application not found');
    }

    existingApplication.state = newState;
    await this.resumeModel.update(existingApplication); // Save the updated state to DynamoDB
    return existingApplication;
  }
}