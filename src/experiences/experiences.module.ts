import { Module } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';

@Module({
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
  imports: [TypeOrmModule.forFeature([Experience])],
})
export class ExperiencesModule {}
