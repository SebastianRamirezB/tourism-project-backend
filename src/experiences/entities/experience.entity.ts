import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExperienceImage } from './experience-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('text')
  email: string;

  @Column('text')
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  review: number;

  @Column('bigint')
  tel: number;

  @Column('bigint')
  whatsappNumber: number;

  @Column('text')
  category: string;

  @Column('text')
  country: string;

  @Column('text')
  town: string;

  @Column('text')
  address: string;

  @Column('text')
  facebookTag: string;

  @Column('text')
  instagramTag: string;

  @Column('text')
  twitterTag: string;

  @Column('bool', {
    default: false,
  })
  food: boolean;

  @Column('bool', {
    default: false,
  })
  transport: boolean;

  @Column('bool', {
    default: false,
  })
  drinks: boolean;

  @Column('bool', {
    default: false,
  })
  equipment: boolean;

  @Column('bool', {
    default: false,
  })
  tickets: boolean;

  @Column('bool', {
    default: false,
  })
  sure: boolean;

  @OneToMany(
    () => ExperienceImage,
    (experienceImage) => experienceImage.experience,
    { cascade: true, eager: true },
  )
  images?: ExperienceImage[];

  @ManyToOne(() => User, (user) => user.experience, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
