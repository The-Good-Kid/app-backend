import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Role } from "../auth/role.entity";
@Entity("application.auth.users")
export class User {
    @PrimaryGeneratedColumn()
    id : number

    @Column({type: 'varchar', length: 255, nullable: true})
    username: string
    
    @Column({type: 'varchar', length: 255, nullable: true})
    password: string
    @Column({type: 'varchar', length: 255, nullable: true})
    email: string
    @Column({type: 'varchar', length: 255, nullable: true})
    first_name: string
    @Column({type: 'varchar', length: 255, nullable: true})
    last_name: string
    @Column({type: 'boolean', nullable: true,default: false})
    is_blocked: boolean
    @Column({type: 'varchar', length: 255, nullable: false})
    contact_number: string
    @Column({type: 'boolean', nullable: true,default: false})
    is_contact_number_verified: boolean
    @Column({type: 'varchar', length: 255, nullable: true})
    meta:string
    @Column({type: 'int', nullable: true})
    user_mapping_id_1: number
    @Column({type: 'timestamp', nullable: false})
    created_at: Date
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date
    @Column({type: 'timestamp', nullable: true, default: null})
    deleted_at: Date
    @ManyToMany(() => Role)
    @JoinTable({
        name: "user_roles_mapping",
        schema: "application.auth",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        }
    })
    roles: Role[]
}