import fs from 'fs';
import { Handler } from './handler';
import { Collection, Message, MessageReaction, User } from 'discord.js';

export class Handlers extends Handler {
    handlers: Collection<string, Handler>;
    handler_files: String[];

    constructor() {
        super('handlers', 'Holds all of the handlers.');

        this.handlers = new Collection<string, Handler>();
        this.handler_files = [];

        if (process.env.NODE_ENV === "production") {
            this.handler_files = fs.readdirSync('./build/handlers').filter(file => !file.includes('handler'));
        } else {
            this.handler_files = fs.readdirSync('./handlers').filter(file => !file.includes('handler'));
        }

        for (const file of this.handler_files) {
            const handler = require(`../handlers/${file}`)
            this.handlers.set(handler.default.name, handler.default);

        }

    }

    async OnMessage(message: Message) {

        this.handlers.forEach(async handler => {
            handler.OnMessage(message);
        });
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        this.handlers.forEach(async handler => {
            handler.OnReaction(user, reaction);
        });
    }
}

export default new Handlers();
