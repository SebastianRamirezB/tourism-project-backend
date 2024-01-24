import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Experience } from './experience.entity';

@Entity()
export class ExperienceImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Experience, (experience) => experience.images, {
    onDelete: 'CASCADE',
  })
  experience: Experience;
}
