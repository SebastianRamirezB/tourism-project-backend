import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
