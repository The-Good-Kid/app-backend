import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,ManyToMany,JoinTable } from 'typeorm';
import { User } from '../../users/user.entity';
import { Item } from './item.entity';

@Entity('application.marketplace.orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_by' ,type: 'int', nullable: false }) 
  createdBy: number;

  @Column({ name: 'order_info', type: 'varchar', length: 255, nullable: true })
  orderInfo: string;

  @Column({ name: 'amount', type: 'numeric', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ name: 'fulfilled_at', type: 'timestamp', nullable: true })
  fulfilledAt: Date;

  @Column({ name: 'order_type', type: 'varchar', length: 255, nullable: false })
  orderType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', default: null, nullable: true })
  deletedAt: Date;
  @ManyToMany(type => Item, item => item)
  @JoinTable({
    name: 'application.marketplace.orderitems',
    joinColumn: { name: 'order_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'item_id', referencedColumnName: 'id' },
  })
  items: Item[];
}
