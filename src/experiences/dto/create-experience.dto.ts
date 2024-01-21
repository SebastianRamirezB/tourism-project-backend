import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  review?: number;

  @IsNumber()
  @IsPositive()
  tel: number;

  @IsString()
  @MinLength(1)
  @IsEmail()
  email: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  whatsappNumber?: number;

  @IsString()
  @MinLength(1)
  category: string;

  @IsString()
  @MinLength(1)
  country: string;

  @IsString()
  @MinLength(1)
  town: string;

  @IsString()
  @MinLength(1)
  address: string;

  @IsString()
  @IsOptional()
  facebookTag?: string;

  @IsString()
  @IsOptional()
  instagramTag?: string;

  @IsString()
  @IsOptional()
  twitterTag?: string;

  @IsBoolean()
  food: boolean;

  @IsBoolean()
  transport: boolean;

  @IsBoolean()
  drinks: boolean;

  @IsBoolean()
  equipment: boolean;

  @IsBoolean()
  tickets: boolean;

  @IsBoolean()
  sure: boolean;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
