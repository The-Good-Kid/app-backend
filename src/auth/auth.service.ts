import { HttpException, HttpStatus, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../users/user.dto';
import twilio, { Twilio } from 'twilio';
import {CommsService} from '../comms/comms.service';
import { Role } from './role.entity';
import { ERole } from './role.enum';
import { SignUpDto } from './signup.dto';
const saltOrRounds = 10;

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private commsService: CommsService,
    ) {

    }

    async validateUserNameAndPassword(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        if (user) {
            const isMatch = await bcrypt.compare(pass, user.password);
            if (!isMatch) {
                return null;
            }
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async get_access_token(user: any) {
        // create a contact number based token
        // const payload = { username: user.username, sub: user.id, contact_number: user.contact_number };
        return {
            access_token: this.jwtService.sign({ userId: user.id, username: user.username, contact_number: user.contact_number, email: user.email }),
            is_user_verified: true
        };
    }
    async confirmPhoneNumber(contact_number: any,verification_code: string=""): Promise<any> {
        const user = await this.usersService.findOne(contact_number);
        if(!user){
            throw new UnauthorizedException('User not found! Please signup first');
        }
        if(verification_code.length > 0 && verification_code!== 'verification_pending'){
        const result = await this.commsService.verifyPhoneNumber(contact_number, verification_code);

        if (!result.valid || result.status !== 'approved') {
            throw new BadRequestException('Wrong code provided');
        }
        if (!user.is_contact_number_verified)
            await this.usersService.markPhoneNumberAsConfirmed(user.id)
        //update user table is_contact_number_verified = true
        return await this.get_access_token({id: user.id, contact_number: user.contact_number, username: user.username, email: user.email,role: user.roles[0].id});
    } 
        return {contact_number: user.contact_number, is_user_verified:false, email: user.email,roleId: user.roles[0].id};
    }
    async signup(signUpDto:SignUpDto): Promise<any> {
        const user = await this.usersService.findOne(signUpDto.contact_number, signUpDto.username, signUpDto.email);
        if (user) {
            throw new HttpException('Come on lets be unique here!', HttpStatus.BAD_REQUEST);
        }
        const hash = await bcrypt.hash(signUpDto.password, saltOrRounds);
        const userDTO = new UserDto();
        userDTO.username = signUpDto.username;
        userDTO.contact_number = signUpDto.contact_number;
        userDTO.email = signUpDto.email;
        userDTO.password = hash;
        const newUser = await this.usersService.createUser(userDTO);
        return this.get_access_token(newUser)
    }

}