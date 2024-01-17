import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './entities/experience.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ExperiencesService {
  private readonly logger = new Logger('ExperiencesService');

  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto) {
    try {
      const experience = this.experienceRepository.create(createExperienceDto);
      await this.experienceRepository.save(experience);

      return experience;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const experiences = await this.experienceRepository.find({
        take: limit,
        skip: offset,
      });
      return experiences;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    let experience: Experience;
    if (isUUID(term)) {
      experience = await this.experienceRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.experienceRepository.createQueryBuilder();
      experience = await queryBuilder
        .where('LOWER(title) =:title or slug =:slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!experience) {
      throw new NotFoundException(`Experience with ${term} not found`);
    }
    return experience;
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    const experience = await this.experienceRepository.preload({
      id: id,
      ...updateExperienceDto,
    });

    if (!experience) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    try {
      await this.experienceRepository.save(experience);
      return experience;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const experience = await this.findOne(id);
    await this.experienceRepository.remove(experience);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
