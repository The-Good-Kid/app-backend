import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("application.auth.roles")
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', length: 255, nullable: false})
    role_name: string

    @Column({type: 'varchar', length: 255, nullable: false})
    permissions: string
    
    @Column({type: 'boolean', nullable: false,default: true})
    is_active: boolean

    @Column({type: 'timestamp', nullable: false})
    created_at: Date
    @Column({type: 'timestamp', nullable: false})
    deleted_at: Date
}