/* eslint-disable @typescript-eslint/no-unused-vars */
import { IMailService } from './interface.service';

export class MockMailService implements IMailService {
  async sendEmailVerificationCode(email: string, code: string) {
    return;
  }

  async sendEmailVerifiedEmail(email: string) {
    return;
  }
}
