export declare class MailService {
    private readonly transporter;
    constructor();
    sendActivationMail(to: string, link: string): Promise<void>;
    recuperation(to: string, link: string): Promise<void>;
}
