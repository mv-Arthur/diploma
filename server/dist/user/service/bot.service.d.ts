import { User } from "../model/user.model";
export declare class BotService {
    private userRepository;
    constructor(userRepository: typeof User);
    private readonly token;
    private bot;
    start(): void;
    activateAdmin(activationLinkAdmin: string): Promise<"пользователь не найден" | "Успех">;
    sendActivationAdmin(activationLinkAdmin: string): Promise<void>;
}
