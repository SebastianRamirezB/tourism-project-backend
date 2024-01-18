import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ExperiencesModule } from 'src/experiences/experiences.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ExperiencesModule],
})
export class SeedModule {}
