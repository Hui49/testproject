import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res,
  NotFoundException,
  ServiceUnavailableException,
  // CacheInterceptor,
  UseGuards,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { of } from 'rxjs';
import { multerOptions } from '../config/multer-config';
import { PdfService } from './pdf.service';
import { Resume } from 'src/pdf/resume.interface';
import { UpdateApplicationDto } from '../pdf/dto/update-application.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/role.enum';
import { JwtAuthGuard } from 'src/auth1/guards/jwt.guard';
import { UpdateStateDto } from './dto/update-state.dto';
import { UploadApplicationResponseDto } from './dto/upload-application-response.dto';

@Controller('media')
@UseGuards(RolesGuard)
export class PdfController {
  constructor(private pdfService: PdfService) {}
  @Post('upload')
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadesume(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadApplicationResponseDto> {
    if (!file) throw new BadRequestException('invalid file');

    const filename = await this.pdfService.parseResume(file);
    const uploadResponse = new UploadApplicationResponseDto();

// Set the properties of the uploadResponse object
    uploadResponse.message = "File uploaded successfully";
    uploadResponse.application_content = filename;
    return uploadResponse
  }

  @Get('all')
  async getAllApplicants(): Promise<Resume[]> {
    return this.pdfService.getAllApplicants();
  }
  @Get('/search')
  async searchApplications(
    @Query('fullName') fullName: string,
    @Query('address') address: string,
    @Query('phoneNumber') phoneNumber: string,
    @Query('email') email: string,
    @Query('skills') skills: string,
  ): Promise<Resume[]> {
    return this.pdfService.searchApplications({ fullName, address, phoneNumber, email, skills });
  }
  @Get(':id')
  async getApplicationById(@Param('id') id: string): Promise<Resume> {
    return this.pdfService.getApplicationById(id);
  }

  @Put('/:id')
  async updateApplication(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationDto,
  ): Promise<Resume> {
    return this.pdfService.updateApplication(id, updateDto);
  }

  @Put(':id/state')
  async updateApplicationState(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateStateDto,
  ): Promise<Resume> {
    return this.pdfService.updateApplicationState(id, updateStateDto.state);
  }

/*
  @Get('url/:mediaId')
  async getMediaURL(@Param('mediaId') mediaId: string): Promise<string> {
    try {
      const url = await this.storageService.getSignedUrl('media/' + mediaId);
      return url;
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('image not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }
  }

  @Get('download/:mediaId')
  async downloadMedia(@Param('mediaId') mediaId: string, @Res() res: Response) {
    try {
      const storageFile = await this.storageService.get('media/' + mediaId);
      res.setHeader('Cache-Control', 'max-age=60d');
      res.end(storageFile.buffer);
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('image not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }
  }
  */
}