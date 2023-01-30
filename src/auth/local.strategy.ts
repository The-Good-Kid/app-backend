import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
        usernameField: 'contact_number',
        passwordField: 'verification_code',
    });
  }

  async validate(contact_number: string,verification_code:string="" ): Promise<any> {
    let user = await this.authService.confirmPhoneNumber(contact_number,verification_code);
    return user;
}
}