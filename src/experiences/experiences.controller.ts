import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  @Auth(ValidRoles.user)
  create(
    @Body() createExperienceDto: CreateExperienceDto,
    @GetUser() user: User,
  ) {
    return this.experiencesService.create(createExperienceDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.experiencesService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.experiencesService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @GetUser() user: User,
  ) {
    return this.experiencesService.update(id, updateExperienceDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.user)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.experiencesService.remove(id);
  }
}
