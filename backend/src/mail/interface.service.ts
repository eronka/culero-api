export const MAIL_SERVICE = 'MAIL_SERVICE';

export interface IMailService {
  sendEmailVerificationCode(email: string, code: string): Promise<void>;
  sendEmailVerifiedEmail(email: string): Promise<void>;
}
