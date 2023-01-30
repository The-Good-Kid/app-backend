import { Inject, Injectable } from '@nestjs/common';
import { ERole } from 'src/auth/role.enum';
import { Repository } from 'typeorm';
import { Role } from '../auth/role.entity';
import { UserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    ) { }

    async findOne(contact_number?: string,username?: string, email?: string): Promise<User | undefined> {
        let user = await this.userRepository.findOne({
            where: [
                { username },
                { contact_number: contact_number },
                { email }
            ],
            relations: ["roles"]
        });

        return user;
    }


    async getProfile(contact_number: string): Promise<UserDto | undefined> {
        const user = await this.userRepository.findOne({ where: { contact_number : contact_number },relations: ["roles"] });
        if (!user) {
            return undefined;
        }
        const userDto = new UserDto();
        userDto.id = user.id;
        userDto.username = user.username;
        userDto.email = user.email;
        userDto.contact_number = user.contact_number;
        userDto.is_contact_number_verified = user.is_contact_number_verified;
        userDto.role_id = user.roles[0].id;

        return userDto;
    }

    async createUser(userDto: UserDto): Promise<User> {
        try {
            const user = new User();
            user.username = userDto.username;
            user.password = userDto.password;
            user.contact_number = userDto.contact_number;
            user.email = userDto.email;
            user.roles = [new Role()];
            user.roles[0].id = userDto.role_name == ERole.Admin ? 2: 1;
            user.created_at = new Date();
            return await this.userRepository.save(user);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async markPhoneNumberAsConfirmed(userId: number) {
        return this.userRepository.update({ id: userId }, {
          is_contact_number_verified: true
        });
    }

}