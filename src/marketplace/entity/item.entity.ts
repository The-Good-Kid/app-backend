import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Provider } from './provider.entity';

@Entity('application.marketplace.item')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_name', type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ name: 'item_type', type: 'varchar', length: 255, nullable: false })
  type: string;

  @Column({ name: 'unique_id', type: 'varchar', length: 255, nullable: false })
  uniqueId: string;

  @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(type => Provider, provider => provider.id)
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @Column({ name: 'created_by', nullable: false })
  createdBy: number;

  @Column({ name: 'deleted_at', type: 'timestamp', default: null, nullable: true })
  deletedAt: Date;
}
