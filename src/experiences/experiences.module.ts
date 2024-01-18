import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { Experience } from './entities/experience.entity';
import { ExperienceImage } from './entities/experience-image.entity';

@Module({
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
  imports: [TypeOrmModule.forFeature([Experience, ExperienceImage])],
})
export class ExperiencesModule {}
