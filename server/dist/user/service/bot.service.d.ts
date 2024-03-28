import { User } from "../model/user.model";
export declare class BotService {
    private userRepository;
    constructor(userRepository: typeof User);
    private readonly token;
    private bot;
    start(): void;
    activateAccounting(activationLinkAdmin: string): Promise<"пользователь не найден" | "Роль успешно заменена">;
    activateAdmin(activationLinkAdmin: string): Promise<"пользователь не найден" | "Успех">;
    sendActivationAdmin(activationLinkAdmin: string): Promise<void>;
}
