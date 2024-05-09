import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { UpdateApplicationDto } from 'src/application/dto/update-application.dto';
import { UpdateStateDto } from 'src/application/dto/update-state.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ApplicationState,
  Application,
} from './interface/application.interface';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadApplicationResponseDto } from './dto/upload-application-response.dto';

describe('ApplicationController', () => {
  let controller: ApplicationController;
  let service: ApplicationService;

  const testApplication: Application = {
    id: 'unique-id-here', // Assign a unique ID
    name: 'test Doe',
    email: 'test.doe@example.com',
    mobile: '123-456-7890',
    address: '123 Main Street, City, Country',
    educations: [],
    profession_experiences: [],
    skills: [],
    state: ApplicationState.NEW,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('SECRET'),
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [ApplicationController],
      providers: [
        {
          provide: ApplicationService,
          useValue: {
            uploadApplication: jest.fn().mockReturnValue(testApplication),
            getAllApplications: jest.fn().mockReturnValue([testApplication]),
            searchApplications: jest.fn().mockReturnValue([testApplication]),
            getApplicationById: jest.fn().mockReturnValue(testApplication),
            updateApplication: jest.fn().mockReturnValue(testApplication),
            updateApplicationState: jest.fn().mockReturnValue(testApplication),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
    service = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadApplication', () => {
    it('should throw BadRequestException when file is not provided', async () => {
      // Mock necessary behavior for the test
      const fileMock = undefined;

      // Call the method being tested and expect it to throw BadRequestException
      await expect(controller.uploadApplication(fileMock)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should return message and filename when file is valid', async () => {
      // Mock necessary behavior for the test
      const fileMock = createMockFile();
      
      const result = await controller.uploadApplication(fileMock);
      const expected = new UploadApplicationResponseDto();

      expected.message = 'File uploaded successfully';
      expected.application_content = testApplication;

      // Assert the expected result
      expect(result).toEqual(expected);
    });
  });
  describe('getAllApplicants', () => {
    it('should return an array of applicants', async () => {
      const result = await controller.getAllApplications();
      const expected = [testApplication];

      expect(result).toEqual(expected);
    });
  });

  describe('searchApplications', () => {
    it('should return an array of resumes', async () => {
      const expected: Application[] = [testApplication]; // Mocked resumes
      const result = await controller.searchApplications(
        'John Doe',
        '',
        '',
        '',
        '',
      );
      expect(result).toEqual(expected);
    });
  });

  describe('getApplicationById', () => {
    it('should return a application by id', async () => {
      const expected: Application = testApplication; // Mocked resume

      const result = await controller.getApplicationById('123');

      expect(result).toEqual(expected);
    });
  });

  describe('updateApplication', () => {
    it('should update a application by id', async () => {
      const updateDto: UpdateApplicationDto = {}; // Mocked update DTO

      const result = await controller.updateApplication('123', updateDto);
      const expected: Application = testApplication; // Mocked resume

      expect(result).toEqual(expected);
    });
  });

  describe('updateApplicationState', () => {
    it('should update the state of a application by id', async () => {
      const updateStateDto: UpdateStateDto = {
        state: ApplicationState.NEW,
      };
      const expected: Application = testApplication; // Mocked resume

      const result = await controller.updateApplicationState(
        '123',
        updateStateDto,
      );

      expect(result).toEqual(expected);
    });
  });

  function createMockFile(): Express.Multer.File {
    return {
      fieldname: 'file',
      originalname: 'mock-file.pdf',
      stream: null,
      encoding: '7bit',
      mimetype: 'application/pdf',
      destination: '',
      filename: 'mock-file.pdf',
      path: '',
      size: 1024,
      buffer: Buffer.from('mock-file-content'),
    };
  }
});
