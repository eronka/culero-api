import { IsString } from 'class-validator';

export class PushTokenDto {
  @IsString()
  token: string;
}
