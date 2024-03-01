export declare class MailService {
    private readonly transporter;
    constructor();
    sendActivationMail(to: string, link: string): Promise<void>;
    sendActivationAdminMail(to: string, link: string, userEmail: string): Promise<void>;
}
