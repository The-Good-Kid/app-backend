import { Entity, PrimaryGeneratedColumn, Column, ManyToOne ,JoinColumn} from 'typeorm';
import { User } from '../../users/user.entity';
import { Activity } from './activity.entity';

@Entity("application.marketplace.user_activity_relation")
export class UserActivityRelation {
@PrimaryGeneratedColumn()
id: number;

@ManyToOne(type => User, user => user.id)
@JoinColumn({ name: 'user'})
user: User;

@ManyToOne(type => Activity, activity => activity.id)
@JoinColumn({ name: 'activity'})
activity: Activity;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
amount_contributed: number;

@Column({ type: 'boolean', default: false, nullable: false })
is_settled: boolean;

@Column({ type: 'timestamp', nullable: false })
created_at: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
updated_at: Date;

@Column({ type: 'timestamp', nullable: true, default: null })
settled_at: Date;
}




