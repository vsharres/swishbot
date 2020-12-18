import fs from 'fs';
import { Handler } from './handler';
import profiler from '../tools/profiler';
import logger from '../tools/logger';
import { Collection, GuildMember, Message, MessageReaction, User } from 'discord.js';

export class Handlers extends Handler {
    message_handlers: Collection<string, Handler>;
    reaction_handlers: Collection<string, Handler>;
    addmember_handlers: Collection<string, Handler>;
    handler_files: String[];

    constructor() {
        super('handlers', true, true);

        this.reaction_handlers = new Collection<string, Handler>();
        this.message_handlers = new Collection<string, Handler>();
        this.addmember_handlers = new Collection<string, Handler>();

        this.handler_files = [];

        if (process.env.NODE_ENV === "production") {
            this.handler_files = fs.readdirSync('./build/handlers').filter(file => !file.includes('handler'));
        } else {
            this.handler_files = fs.readdirSync('./handlers').filter(file => !file.includes('handler'));
        }

        for (const file of this.handler_files) {
            const handler = require(`../handlers/${file}`);

            if (handler.default.catch_reaction) {
                this.reaction_handlers.set(handler.default.name, handler.default);
            }

            if (handler.default.catch_message) {
                this.message_handlers.set(handler.default.name, handler.default);
            }

            if (handler.default.catch_addmember) {
                this.addmember_handlers.set(handler.default.name, handler.default);
            }

        }

    }

    async OnMessage(message: Message) {

        this.message_handlers.forEach(async handler => {
            if (process.env.NODE_ENV === 'development') profiler.startTimer(handler.name);
            handler.OnMessage(message)
                .then(() => {
                    if (process.env.NODE_ENV === 'development') logger.log('info', `[${handler.name}]: time to execute: ${profiler.endTimer(handler.name)} ms`);
                });
        });
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        this.reaction_handlers.forEach(async handler => {
            if (process.env.NODE_ENV === 'development') profiler.startTimer(handler.name);
            handler.OnReaction(user, reaction)
                .then(() => {
                    if (process.env.NODE_ENV === 'development') logger.log('info', `[${handler.name}]: time to execute: ${profiler.endTimer(handler.name)} ms`);
                });
        });
    }

    async OnMemberAdd(member: GuildMember) {
        this.addmember_handlers.forEach(async handler => {
            if (process.env.NODE_ENV === 'development') profiler.startTimer(handler.name);
            handler.OnMemberAdd(member)
                .then(() => {
                    if (process.env.NODE_ENV === 'development') logger.log('info', `[${handler.name}]: time to execute: ${profiler.endTimer(handler.name)} ms`);
                });
        });
    }
}

export default new Handlers();
