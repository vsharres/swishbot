import { Message, User, MessageReaction } from 'discord.js';

export class Handler {
    name: string;
    description: string;

    constructor(
        name: string,
        description: string
    ) {
        this.name = name;
        this.description = description;
    }

    async OnMessage(message: Message): Promise<any> { }
    async OnReaction(user: User, reaction: MessageReaction): Promise<any> { }
};