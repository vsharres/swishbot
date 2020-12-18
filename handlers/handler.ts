import { Message, User, MessageReaction, GuildMember } from 'discord.js';

export class Handler {
    name: string;
    catch_message: boolean;
    catch_reaction: boolean;
    catch_addmember: boolean;

    constructor(
        name: string,
        catch_message: boolean = false,
        catch_reaction: boolean = false,
        catch_addmember: boolean = false

    ) {
        this.name = name;
        this.catch_message = catch_message;
        this.catch_reaction = catch_reaction;
        this.catch_addmember = catch_addmember;
    }

    async OnMessage(message: Message): Promise<any> { }
    async OnReaction(user: User, reaction: MessageReaction): Promise<any> { }
    async OnMemberAdd(member: GuildMember): Promise<any> { }
};