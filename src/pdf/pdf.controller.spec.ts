import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { UpdateApplicationDto } from 'src/pdf/dto/update-application.dto';
import { UpdateStateDto } from 'src/pdf/dto/update-state.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApplicationState, Resume } from './resume.interface';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { UploadApplicationResponseDto } from './dto/upload-application-response.dto';

describe('PdfController', () => {
  let controller: PdfController;
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
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:  [JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('SECRET'),
        }),
        inject: [ConfigService],
      })],
      controllers: [PdfController],
      providers: [
        {
          provide: PdfService,
          useValue: {
            parseResume: jest.fn().mockReturnValue(newResume),
            getAllApplicants: jest.fn().mockReturnValue([newResume]),
            searchApplications: jest.fn().mockReturnValue([newResume]),
            getApplicationById: jest.fn().mockReturnValue(newResume),
            updateApplication: jest.fn().mockReturnValue(newResume),
            updateApplicationState: jest.fn().mockReturnValue(newResume),
          },
        },
      ],
    }).compile();

    controller = module.get<PdfController>(PdfController);
    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadesume', () => {
    it('should throw BadRequestException when file is not provided', async () => {
      // Mock necessary behavior for the test
      const fileMock = undefined;

      // Call the method being tested and expect it to throw BadRequestException
      await expect(controller.uploadesume(fileMock)).rejects.toThrowError(BadRequestException);
    });

    it('should return message and filename when file is valid', async () => {
      // Mock necessary behavior for the test
      const fileMock = createMockFile();
      
      // jest.spyOn(service, 'parseResume').mockResolvedValue( 'mock-file.pdf');

    //   const result = await controller.getAllApplicants();

      // Call the method being tested
      const result = await controller.uploadesume(fileMock);
      const expected = new UploadApplicationResponseDto();

      // Set the properties of the uploadResponse object
      expected.message = "File uploaded successfully";
      expected.application_content = newResume;
      
      // Assert the expected result
      expect(result).toEqual(expected);
    });

    // Add more test cases as needed
  });
  describe('getAllApplicants', () => {
    it('should return an array of applicants', async () => {

      const result = await controller.getAllApplicants();
      const expected = [newResume];

      expect(result).toEqual(expected);
    });
  });

  describe('searchApplications', () => {
    it('should return an array of resumes', async () => {
      const expected: Resume[] = [newResume]; // Mocked resumes
      // jest.spyOn(pdfService, 'searchApplications').mockResolvedValue(resumes);
      const result = await controller.searchApplications('John Doe', '', '', '', '');
      expect(result).toEqual(expected);
    });
  });

  describe('getApplicationById', () => {
    it('should return a resume by id', async () => {
      const expected: Resume = newResume; // Mocked resume
      // jest.spyOn(pdfService, 'getApplicationById').mockResolvedValue(resume);

      const result = await controller.getApplicationById('123');
      
      expect(result).toEqual(expected);
    });
  });

  describe('updateApplication', () => {
    it('should update a resume by id', async () => {
      const updateDto: UpdateApplicationDto = {}; // Mocked update DTO
      // jest.spyOn(pdfService, 'updateApplication').mockResolvedValue(updatedResume);

      const result = await controller.updateApplication('123', updateDto);
      const expected: Resume = newResume; // Mocked resume

      expect(result).toEqual(expected);
    });
  });

  describe('updateApplicationState', () => {
    it('should update the state of a resume by id', async () => {
      const updateStateDto: UpdateStateDto = {
        state: ApplicationState.NEW
      }; 
      const expected: Resume = newResume; // Mocked resume

      // jest.spyOn(pdfService, 'updateApplicationState').mockResolvedValue(updatedResume);

      const result = await controller.updateApplicationState('123', updateStateDto);

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
    size: 1024, // Adjust the size as needed
    buffer: Buffer.from('mock-file-content'), // Provide mock file content as a buffer
  };
}

})