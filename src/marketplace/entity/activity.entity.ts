import { Entity, PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity("application.marketplace.activity")
export class Activity {
@PrimaryGeneratedColumn()
id: number;

@Column({ type: 'varchar', length: 255, nullable: false })
activity_name: string;

@Column({ type: 'text', nullable: true })
description: string;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
total_amount: number;

@Column({type: 'boolean', default: false, nullable: false})
is_settled: boolean;

@Column({ type: 'timestamp', nullable: false })
created_at: Date;

@ManyToOne(type => User, user => user.id)
@JoinColumn({ name: 'created_by'})
created_by: User;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
updated_at: Date;

@Column({ type: 'timestamp', nullable: true, default: null })
deleted_at: Date;
}