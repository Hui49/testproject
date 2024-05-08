import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { ResumeSchema } from './schema/resume.schema';
import { DynamooseModule } from 'nestjs-dynamoose';
import { RolesGuard } from 'src/auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    DynamooseModule.forFeature([
     { name: 'Resume', schema: ResumeSchema },
   ]),],
  providers: [PdfService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // }
  ],
  controllers: [PdfController],
})
export class PdfModule {}
