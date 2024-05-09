import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as PDFParser from 'pdf-parse';
import { File } from './interface/file.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import axios from 'axios';
import {
  ApplicationState,
  Application as Application,
  ApplicationKey as ApplicationKey,
} from './interface/application.interface';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { config } from '../shared/config/config';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel('Application')
    private applicationModel: Model<Application, ApplicationKey>,
  ) {}
  private readonly logger = new Logger(ApplicationService.name);

  async queryOpenAI(prompt: string): Promise<any> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${config.openaiAccessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const content = response.data?.choices?.[0]?.message?.content;
      if (content) {
        return content;
    } else {
        this.logger.error("Failed to get response content");
        throw new Error('Failed to get response content from OpenAI');
    }
    } catch (error) {
      this.logger.error(`Error querying OpenAI: ${error.message}`);
      throw new Error('Failed to query OpenAI');
    }
  }

  async uploadApplication(pdfFile: File): Promise<any> {
    try{
      this.logger.log('starting to parsing application');
      const pdfData = await PDFParser(pdfFile.buffer);
      const prompt = this.getPrompt(pdfData.text);
      const responseText = await this.queryOpenAI(`${prompt}`);
      const applicationData = JSON.parse(responseText);
      this.logger.log('starting to upload application');
      await this.saveApplicationFromJson(applicationData);
      this.logger.log('completed uploading application');
      return applicationData;
    } catch (error) {
      this.logger.error(`Error in upload Application : ${error.message}`);
      throw new Error('Error in upload Application');
    }

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

  async saveApplicationFromJson(jsonData: any) {
    const { v4: uuidv4 } = require('uuid');
    const applicationData: Application = {
      id: uuidv4(),
      name: jsonData.name,
      mobile: jsonData.mobile,
      address: jsonData.address,
      email: jsonData.email,
      skills: jsonData.skills,
      state: ApplicationState.NEW,
      educations: jsonData.educations,
      profession_experiences: jsonData.profession_experiences,
    };
    await this.applicationModel.create(applicationData);
  }

  async getAllApplications(): Promise<Application[]> {
    try {
      const applications = await this.applicationModel.scan().exec();
      return applications;
    } catch (error) {
      this.logger.error('Error querying all application data:', error);
      throw new Error(
        `Failed to retrieve applications from DynamoDB: ${error.message}`,
      );
    }
  }

  async getApplicationById(applicationId: string): Promise<Application> {
    try {
      const applicationData = await this.applicationModel.get({ id: applicationId });
      return applicationData;
    } catch (error) {
      this.logger.error('Error querying application data:', error);
      throw error;
    }
  }

  async updateApplication(
    id: string,
    updateDto: UpdateApplicationDto,
  ): Promise<Application> {
    const existingApplication = await this.getApplicationById(id); // Pass an object with the primary key attribute(s)
    if (!existingApplication) {
      throw new NotFoundException('Application not found');
    }

    const updatedApplication: Application = {
      ...existingApplication,
      ...updateDto,
      id,
    };

    try {
      await this.applicationModel.update(updatedApplication);
      return updatedApplication;
    } catch (error) {
      this.logger.error(`failed to update: ${error.message}`)

      throw new Error(
        `Failed to update application from DynamoDB: ${error.message}`,
      );
    }
  }

  async searchApplications(criteria: {
    fullName?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    skills?: string;
  }): Promise<Application[]> {
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
    return this.applicationModel.scan(queryConditions).exec();
  }

  async updateApplicationState(
    id: string,
    newState: ApplicationState,
  ): Promise<Application> {
    const existingApplication = await this.getApplicationById(id);
    if (!existingApplication) {
      throw new NotFoundException('Application not found');
    }

    existingApplication.state = newState;
    this.logger.log(`start to update application with application id: ${existingApplication.id} `)
    await this.applicationModel.update(existingApplication); // Save the updated state to DynamoDB
    return existingApplication;
  }
}
