import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Item } from './item.entity';

@Entity('application.marketplace.provider')
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'provider_name', type: 'varchar', length: 255, nullable: false })
    providerName: string;

    @Column({ name: 'meta', type: 'varchar', length: 255, nullable: true })
    meta: string;

    @Column({ name: 'contact_number', type: 'varchar', length: 255, nullable: true })
    contactNumber: string;

    @Column({ name: 'pincode', type: 'int', nullable: true })
    pincode: number;

    @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
    address: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(type => Item, item => item.provider)
    items: Item[];

    @Column({ name: 'deleted_at', type: 'timestamp', default: null, nullable: true })
    deletedAt: Date;
}
