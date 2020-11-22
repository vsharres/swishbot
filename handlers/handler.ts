import { Message, User, MessageReaction } from 'discord.js';

export class Handler {
    name: string;
    description: string;
    catch_message: boolean;
    catch_reaction: boolean;

    constructor(
        name: string,
        description: string,
        catch_message: boolean = false,
        catch_reaction: boolean = false,
    ) {
        this.name = name;
        this.description = description;
        this.catch_message = catch_message;
        this.catch_reaction = catch_reaction;
    }

    async OnMessage(message: Message): Promise<any> { }
    async OnReaction(user: User, reaction: MessageReaction): Promise<any> { }
};