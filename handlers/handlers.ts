import fs from 'fs';
import { Handler } from './handler';
import profiler from '../tools/profiler';
import logger from '../tools/logger';
import { Client, Collection, GuildMember, Message, MessageReaction, User } from 'discord.js';

export class Handlers extends Handler {
    message_handlers: Collection<string, Handler>;
    deleteMessage_handlers: Collection<string, Handler>;
    reaction_handlers: Collection<string, Handler>;
    addMember_handlers: Collection<string, Handler>;
    updateMember_handlers: Collection<string, Handler>;

    handler_files: String[];

    constructor(client: Client) {
        super(client, 'handlers', true, true);

        this.reaction_handlers = new Collection<string, Handler>();
        this.message_handlers = new Collection<string, Handler>();
        this.deleteMessage_handlers = new Collection<string, Handler>();
        this.addMember_handlers = new Collection<string, Handler>();
        this.updateMember_handlers = new Collection<string, Handler>();


        this.handler_files = [];

        if (process.env.NODE_ENV === "production") {
            this.handler_files = fs.readdirSync('./build/handlers').filter(file => !file.includes('handler'));
        } else {
            this.handler_files = fs.readdirSync('./build/handlers').filter(file => !file.includes('handler'));
        }

        for (const file of this.handler_files) {
            const handler = require(`../handlers/${file}`)(this.client) as Handler;

            if (handler.catch_reaction) {
                this.reaction_handlers.set(handler.name, handler);
            }

            if (handler.catch_message) {
                this.message_handlers.set(handler.name, handler);
            }

            if (handler.catch_addmember) {
                this.addMember_handlers.set(handler.name, handler);
            }

            if (handler.catch_message_delete) {
                this.deleteMessage_handlers.set(handler.name, handler);
            }

            if (handler.catch_member_update) {
                this.updateMember_handlers.set(handler.name, handler);
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
        this.addMember_handlers.forEach(async handler => {
            if (process.env.NODE_ENV === 'development') profiler.startTimer(handler.name);
            handler.OnMemberAdd(member)
                .then(() => {
                    if (process.env.NODE_ENV === 'development') logger.log('info', `[${handler.name}]: time to execute: ${profiler.endTimer(handler.name)} ms`);
                });
        });
    }

    async OnMessageDelete(message: Message) {
        this.deleteMessage_handlers.forEach(async handler => {
            if (process.env.NODE_ENV === 'development') profiler.startTimer(handler.name);
            handler.OnMessageDelete(message)
                .then(() => {
                    if (process.env.NODE_ENV === 'development') logger.log('info', `[${handler.name}]: time to execute: ${profiler.endTimer(handler.name)} ms`);
                });
        });
    }

    async OnMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {
        this.updateMember_handlers.forEach(async handler => {
            if (process.env.NODE_ENV === 'development') profiler.startTimer(handler.name);
            handler.OnMemberUpdate(oldMember, newMember)
                .then(() => {
                    if (process.env.NODE_ENV === 'development') logger.log('info', `[${handler.name}]: time to execute: ${profiler.endTimer(handler.name)} ms`);
                });

        });

    }
}

module.exports = (client: Client) => {
    return new Handlers(client);
}