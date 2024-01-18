import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './entities/experience.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ExperienceImage } from './entities/experience-image.entity';

@Injectable()
export class ExperiencesService {
  private readonly logger = new Logger('ExperiencesService');

  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,

    @InjectRepository(ExperienceImage)
    private readonly experienceImageRepository: Repository<ExperienceImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createExperienceDto: CreateExperienceDto) {
    try {
      const { images = [], ...experienceDetails } = createExperienceDto;
      const experience = this.experienceRepository.create({
        ...experienceDetails,
        images: images.map((image) =>
          this.experienceImageRepository.create({ url: image }),
        ),
      });
      await this.experienceRepository.save(experience);

      return { ...experience, images };
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
        relations: {
          images: true,
        },
      });
      return experiences.map((experience) => ({
        ...experience,
        images: experience.images.map((img) => img.url),
      }));
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    let experience: Experience;
    if (isUUID(term)) {
      experience = await this.experienceRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.experienceRepository.createQueryBuilder('exp');
      experience = await queryBuilder
        .where('LOWER(title) =:title or slug =:slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('exp.images', 'expImages')
        .getOne();
    }

    if (!experience) {
      throw new NotFoundException(`Experience with ${term} not found`);
    }
    return experience;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    const { images, ...toUpdate } = updateExperienceDto;

    const experience = await this.experienceRepository.preload({
      id: id,
      ...toUpdate,
    });

    if (!experience) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ExperienceImage, {
          experience: { id },
        });
        experience.images = images.map((image) =>
          this.experienceImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(experience);

      // await this.experienceRepository.save(experience);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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

  async deletAllExperiences() {
    const query = this.experienceRepository.createQueryBuilder('experience');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
