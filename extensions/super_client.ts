import { Client, Intents, Collection } from 'discord.js';
import DisTube from 'distube';

class SuperClient extends Client {

    public commands: Collection<unknown, any>;
    public aliases: Collection<unknown, any>;
    public categories: Array<string>;
    public distube: DisTube;

    constructor(){
        super({ intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_VOICE_STATES
        ]});
        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = [];
        this.distube = new DisTube(this, { youtubeDL: false });
    }

}

export default SuperClient;
