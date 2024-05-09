import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  UseGuards,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../shared/config/multer-config';
import { ApplicationService as ApplicationService } from './application.service';
import { Application } from 'src/application/interface/application.interface';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../shared/enum/role.enum';
import { UpdateStateDto } from './dto/update-state.dto';
import { UploadApplicationResponseDto } from './dto/upload-application-response.dto';

@Controller('application')
@UseGuards(RolesGuard)
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}
  @Post('upload')
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadApplication(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadApplicationResponseDto> {
    if (!file) throw new BadRequestException('invalid file');

    const result = await this.applicationService.uploadApplication(file);
    const uploadResponse = new UploadApplicationResponseDto();

    // Set the properties of the uploadResponse object
    uploadResponse.message = 'File uploaded successfully';
    uploadResponse.application_content = result;
    return uploadResponse;
  }

  @Get('all')
  @Roles(Role.Admin)
  async getAllApplications(): Promise<Application[]> {
    return this.applicationService.getAllApplications();
  }

  @Get('/search')
  @Roles(Role.Admin)
  async searchApplications(
    @Query('fullName') fullName: string,
    @Query('address') address: string,
    @Query('phoneNumber') phoneNumber: string,
    @Query('email') email: string,
    @Query('skills') skills: string,
  ): Promise<Application[]> {
    return this.applicationService.searchApplications({
      fullName,
      address,
      phoneNumber,
      email,
      skills,
    });
  }

  @Get(':id')
  @Roles(Role.Admin)
  async getApplicationById(@Param('id') id: string): Promise<Application> {
    return this.applicationService.getApplicationById(id);
  }

  @Put('/:id')
  @Roles(Role.Admin)
  async updateApplication(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.applicationService.updateApplication(id, updateDto);
  }

  @Put(':id/state')
  @Roles(Role.Admin)
  async updateApplicationState(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateStateDto,
  ): Promise<Application> {
    return this.applicationService.updateApplicationState(
      id,
      updateStateDto.state,
    );
  }
}
