import { Client } from "@client/Client";
import { Collection } from "@structures/Collection";
import { TextChannel } from "@structures/TextChannel";
import { ParseApiError } from "@utils/ParseApiError";

export class GuildChannelManager extends Collection<TextChannel> {
    public guild_id: string;
    #client: Client;

    public constructor(client: Client, guild_id:  string, channels: Array<TextChannel> = []) {
        super(TextChannel);

        if(!client) throw new Error("Client is not valid.");
        if(!guild_id) throw new Error("Guild ID is not valid.");

        if(!Array.isArray(channels)) {
            channels = [channels];
        }

        this.guild_id = guild_id;
        this.#client = client;

        channels.forEach(channel => this.set(channel.id, new TextChannel(channel, this.#client)));
    }

    public async fetch(id: string): Promise<TextChannel> {
        try {
            console.log(this.guild_id)
            let res = await this.#client.rest.request({
                endpoint: `channels/${id}`,
                method: 'get',
                authorization: true
            });

            return new TextChannel(res, this.#client);
        } catch(_: any) {
            throw Error(ParseApiError(_));
        }
    }
}