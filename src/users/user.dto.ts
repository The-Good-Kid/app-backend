export class UserDto {
    id: number;
    username?: string;
    password?: string;
    contact_number: string;
    email: string;
    is_contact_number_verified: boolean;
    role_name?: string;
    role_id?: number;
  }