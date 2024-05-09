import { ApplicationService } from './application.service';
import * as fs from 'fs';
import { Application } from './interface/application.interface';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationState } from './interface/application.interface';
import { NotFoundException } from '@nestjs/common';

describe('ApplicationService', () => {
  let service: ApplicationService;
  const testApplication: Application = {
    id: 'unique-id-here', // Assign a unique ID
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '123-456-7890',
    address: '123 Main Street, City, Country',
    educations: [],
    skills: [],
    profession_experiences: [],
    state: ApplicationState.NEW,
  };
  beforeEach(() => {
    const mockApplicationModel = {
      create: jest.fn(),
      scan: jest.fn().mockReturnThis(),
      exec: jest.fn().mockReturnValue([testApplication]),
      get: jest.fn().mockReturnValue(testApplication),
      update: jest.fn(),
    };
    service = new ApplicationService(mockApplicationModel as any);
  });

  describe('uploadApplication', () => {
    it('should parse the application data from PDF', async () => {
      // Mocking the PDF file
      const mockPdfFile = createMockFile();

      // Mocking the response from the AI service
      const mockApplicationData = {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '1234567890',
      };
      jest
        .spyOn(service, 'queryOpenAI')
        .mockResolvedValue(JSON.stringify(mockApplicationData));

      jest
        .spyOn(service, 'saveApplicationFromJson')
        .mockResolvedValue(undefined);

      const result = await service.uploadApplication(mockPdfFile);

      expect(result).toEqual(mockApplicationData);
    });
  });

  describe('getAllApplications', () => {
    it('should return all applications from the database', async () => {
      const exected = [testApplication];
      const result = await service.getAllApplications();
      expect(result).toEqual(exected);
    });
  });

  describe('getApplicationById', () => {
    it('should return application data for a valid application ID', async () => {
      const applicationId = 'valid-application-id';
      const result = await service.getApplicationById(applicationId);
      const exected = testApplication;

      expect(result).toEqual(exected);
    });
  });

  describe('searchApplications', () => {
    it('should search for applications with specified criteria', async () => {
      const criteria = {
        fullName: 'John Doe',
        address: '123 Main Street',
        phoneNumber: '123-456-7890',
        email: 'john.doe@example.com',
        skills: 'JavaScript',
      };

      // Call the searchApplications method
      const results = await service.searchApplications(criteria);

      expect(results).toEqual([testApplication]);
    });
  });
  describe('updateApplication', () => {
    it('should update the existing application', async () => {
      jest
        .spyOn(service, 'getApplicationById')
        .mockResolvedValue(testApplication);

      // Create an update DTO
      const updateDto = {
        name: 'Updated Name',
        email: 'updated.email@example.com',
      };

      const updatedApplication = await service.updateApplication(
        testApplication.id,
        updateDto,
      );

      expect(updatedApplication).toEqual({
        ...testApplication,
        ...updateDto,
      });
    });

    it('should throw NotFoundException if the application does not exist', async () => {
      // Mock the getApplicationById method to return undefined
      jest.spyOn(service, 'getApplicationById').mockResolvedValue(undefined);

      try {
        await service.updateApplication('non-existing-id', {});
      } catch (error) {
        // Assert that a NotFoundException is thrown
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Application not found');
      }
    });
  });
  describe('updateApplicationState', () => {
    it('should update application state', async () => {
      jest.spyOn(service, 'getApplicationById').mockResolvedValueOnce({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobile: '123-456-7890',
        address: '123 Main Street, City, Country',
        educations: [],
        skills: [],
        profession_experiences: [],
        state: ApplicationState.NEW,
      });

      const updateMock = jest.fn().mockResolvedValueOnce({});
      jest.spyOn(service['applicationModel'], 'update').mockReturnValueOnce();

      const updatedApplication = await service.updateApplicationState(
        testApplication.id,
        ApplicationState.APPROVED,
      );

      expect(service.getApplicationById).toHaveBeenCalledWith(
        testApplication.id,
      );

      // Assert that the method returns the updated application
      expect(updatedApplication.state).toEqual(ApplicationState.APPROVED);
    });

    it('should throw NotFoundException if application does not exist', async () => {
      jest.spyOn(service, 'getApplicationById').mockResolvedValueOnce(null);

      await expect(
        service.updateApplicationState('1', ApplicationState.APPROVED),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  function createMockFile(): Express.Multer.File {
    const current = process.cwd();
    const filePath = current + '/src/application/test.pdf';
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
});
