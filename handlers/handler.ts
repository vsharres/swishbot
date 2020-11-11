import { Logger } from 'winston';
import { Message, User, MessageReaction } from 'discord.js';

export class Handler {
    name: string;
    description: string;
    logger: Logger;

    constructor(
        name: string,
        description: string,
        logger: Logger
    ) {
        this.name = name;
        this.description = description;
        this.logger = logger;
    }

    async OnMessage(message: Message): Promise<any> { }
    async OnReaction(user: User, reaction: MessageReaction): Promise<any> { }
};