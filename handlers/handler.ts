import { Message, User, MessageReaction, GuildMember, Client } from 'discord.js';

export class Handler {
    client: Client;
    name: string;
    catch_message: boolean;
    catch_reaction: boolean;
    catch_addmember: boolean;
    catch_message_delete: boolean;
    catch_member_update: boolean;

    constructor(
        client: Client,
        name: string,
        catch_message: boolean = false,
        catch_reaction: boolean = false,
        catch_addmember: boolean = false,
        catch_message_delete: boolean = false,
        catch_member_update: boolean = false

    ) {
        this.client = client;
        this.name = name;
        this.catch_message = catch_message;
        this.catch_reaction = catch_reaction;
        this.catch_addmember = catch_addmember;
        this.catch_message_delete = catch_message_delete;
        this.catch_member_update = catch_member_update;
    }

    async OnMessage(message: Message): Promise<any> { }
    async OnMessageDelete(message: Message): Promise<any> { }
    async OnReaction(user: User, reaction: MessageReaction): Promise<any> { }
    async OnMemberAdd(member: GuildMember): Promise<any> { }
    async OnMemberUpdate(oldMember: GuildMember, newMember: GuildMember): Promise<any> { }
};