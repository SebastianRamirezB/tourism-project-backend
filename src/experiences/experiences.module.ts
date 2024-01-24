import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { Experience } from './entities/experience.entity';
import { ExperienceImage } from './entities/experience-image.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
  imports: [
    TypeOrmModule.forFeature([Experience, ExperienceImage]),
    AuthModule,
  ],
})
export class ExperiencesModule {}
