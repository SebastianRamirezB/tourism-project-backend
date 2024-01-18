import { Injectable } from '@nestjs/common';
import { ExperiencesService } from '../experiences/experiences.service';

@Injectable()
export class SeedService {
  constructor(private readonly experiencesService: ExperiencesService) {}

  async runSeed() {
    await this.insertNewExperiences();
    return 'SEED EXECUTED';
  }

  private async insertNewExperiences() {
    await this.experiencesService.deletAllExperiences();
    return true;
  }
}
