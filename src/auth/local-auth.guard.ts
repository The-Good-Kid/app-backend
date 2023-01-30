import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    getRequestCredentials(request) {
        return {
            contact_number: request.body.contact_number,
            verification_code: request.body?.verification_code || "",
        };
    }
}