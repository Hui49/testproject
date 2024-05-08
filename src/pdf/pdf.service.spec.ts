import { PdfService } from './pdf.service';
import * as fs from 'fs';
import { Resume } from './resume.interface';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationState } from './resume.interface';
import { NotFoundException } from '@nestjs/common';

describe('PdfService', () => {
  let service: PdfService;
  const newResume: Resume = {
    id: 'unique-id-here', // Assign a unique ID
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '123-456-7890',
    address: '123 Main Street, City, Country',
    educations: [],
    profession_experiences: [],
    state: ApplicationState.NEW,
  };
  beforeEach(() => {
    // Mocking the Resume Model
    const mockResumeModel = {
      create: jest.fn(),
      scan: jest.fn().mockReturnThis(),
      exec: jest.fn().mockReturnValue([newResume]),
      get: jest.fn().mockReturnValue(newResume),
      update: jest.fn(),
    };
    service = new PdfService(mockResumeModel as any);
  });

  describe('parseResume', () => {
    it('should parse the resume data from PDF', async () => {
      // Mocking the PDF file
      const mockPdfFile = createMockFile();

      // Mocking the response from the AI service
      const mockResumeData = { name: 'John Doe', email: 'john@example.com', mobile: '1234567890' };
      jest.spyOn(service, 'queryOpenAI').mockResolvedValue(JSON.stringify(mockResumeData));

      // Mocking the saveResumeFromJson method
      jest.spyOn(service, 'saveResumeFromJson').mockResolvedValue(undefined);

      const result = await service.parseResume(mockPdfFile);

      expect(result).toEqual(mockResumeData);
    });
  });

  describe('getAllApplicants', () => {
    it('should return all applicants from the database', async () => {
      // Mocking the list of resumes
      const exected = [newResume]
      const result = await service.getAllApplicants();
      expect(result).toEqual(exected);
    });
  });
  
  describe('getApplicationById', () => {
    it('should return resume data for a valid application ID', async () => {
      // Mock the resumeModel.get method to return sample resume data
      const mockResumeData = {
        id: 'unique-id-here',
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobile: '123-456-7890',
        address: '123 Main Street, City, Country',
        educations: [],
        profession_experiences: [],
        state: 'New',
      };
      // jest.spyOn(service['resumeModel'], 'get').mockResolvedValue(newResume);
  
      // Call the getApplicationById method with a valid application ID
      const applicationId = 'valid-application-id';
      const result = await service.getApplicationById(applicationId);
      const exected = newResume

      // Assert that the result matches the expected resume data
      expect(result).toEqual(exected);
    });
  });

  describe('searchApplications', () =>{

    it('should search for resumes with specified criteria', async () => {
      // Mock the scan method of the resumeModel
      // const scanMock = jest.fn().mockReturnValueOnce({
      //   exec: jest.fn().mockResolvedValueOnce([{ id: '1', name: 'John Doe' }]),
      // });
  
      // Define search criteria
      const criteria = {
        fullName: 'John Doe',
        address: '123 Main Street',
        phoneNumber: '123-456-7890',
        email: 'john.doe@example.com',
        skills: 'JavaScript',
      };
  
      // Call the searchApplications method
      const results = await service.searchApplications(criteria);
  
      // Assert that the scan method is called with the correct query conditions
      // expect(scanMock).toHaveBeenCalledWith({
      //   name: { contains: criteria.fullName },
      //   address: { contains: criteria.address },
      //   mobile: { contains: criteria.phoneNumber },
      //   email: { contains: criteria.email },
      //   skills: { contains: criteria.skills },
      // });
  
      // Assert that the method returns the expected results
      expect(results).toEqual([newResume]);
    });
  });
  describe('updateApplication', () =>{
    it('should update the existing resume', async () => {
      // Mock the getApplicationById method to return an existing resume
      const existingResume = {
        id: 'unique-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobile: '123-456-7890',
        address: '123 Main Street, City, Country',
        educations: [],
        profession_experiences: [],
        state: 'New',
      };
      jest.spyOn(service, 'getApplicationById').mockResolvedValue(newResume);
  
      // Mock the update method of the resumeModel
      // jest.spyOn(service['resumeModel'], 'update').mockResolvedValue(newResume);
  
      // Create an update DTO
      const updateDto = {
        name: 'Updated Name',
        email: 'updated.email@example.com',
      };
  
      // Call the updateApplication method
      const updatedResume = await service.updateApplication(newResume.id, updateDto);
  
      // Assert that the resume is updated correctly
      expect(updatedResume).toEqual({
        ...newResume,
        ...updateDto,
      });
    });
  
    it('should throw NotFoundException if the resume does not exist', async () => {
      // Mock the getApplicationById method to return undefined
      jest.spyOn(service, 'getApplicationById').mockResolvedValue(undefined);
  
      // Call the updateApplication method with a non-existing resume ID
      try {
        await service.updateApplication('non-existing-id', {});
      } catch (error) {
        // Assert that a NotFoundException is thrown
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Resume not found');
      }
    });
  });
  describe('updateApplicationState', () =>{
    it('should update application state', async () => {
      // Mock the update method of the resumeModel
      jest.spyOn(service, 'getApplicationById').mockResolvedValueOnce({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobile: '123-456-7890',
        address: '123 Main Street, City, Country',
        educations: [],
        profession_experiences: [],
        state: ApplicationState.NEW,
      });
  
      // Mock the update method of the resumeModel
      const updateMock = jest.fn().mockResolvedValueOnce({});
      jest.spyOn(service['resumeModel'], 'update').mockReturnValueOnce();
    
      // Call the updateApplicationState method with valid parameters
      const updatedApplication = await service.updateApplicationState(newResume.id, ApplicationState.APPROVED);
  
      // Assert that the getApplicationById method is called with the correct ID
      expect(service.getApplicationById).toHaveBeenCalledWith(newResume.id,);
  
      // Assert that the method returns the updated application
      expect(updatedApplication.state).toEqual(
      ApplicationState.APPROVED
    );
  });

    it('should throw NotFoundException if application does not exist', async () => {
      // Mock the getApplicationById method to return null
      jest.spyOn(service, 'getApplicationById').mockResolvedValueOnce(null);
  
      // Call the updateApplicationState method with an invalid application ID
      await expect(service.updateApplicationState('1', ApplicationState.APPROVED)).rejects.toThrowError(NotFoundException);
    });
})

  function createMockFile(): Express.Multer.File {
    const current = process.cwd();
    const filePath = current + '/src/pdf/test.pdf';
    const fileExists = fs.existsSync(filePath);

    const pdfFileContent = fs.readFileSync(filePath);

    return {
      fieldname: 'file',
      originalname: 'mock-file.pdf',
      stream: null,
      encoding: '7bit',
      mimetype: 'application/pdf',
      destination: '',
      filename: 'mock-file.pdf',
      path: '',
      size: 1024, // Adjust the size as needed
      buffer: pdfFileContent, // Provide mock file content as a buffer
    };
  }
  // Add more tests for other methods such as getApplicationById, updateApplication, searchApplications, and updateApplicationState
});
