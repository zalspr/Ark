
    import Discord from 'discord.js';
    import SuperClient from './extensions/super_client';
    import { prefix } from './databases/preferences.json';

    require('dotenv').config();
    console.log('\n');

    const client = new SuperClient();
    client.once('ready', () => {

        console.log('\n  ❱❱ Online. \n');
        client.user!.setPresence({ activities: [{
            name: 'the moon',
            type: 'WATCHING',
            url: "https://www.twitch.tv/monstercat"
        }], status: 'dnd' });
    });

    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.categories = [];

    import DisTube from './extensions/distube_handler';
    DisTube(client);

    import Handler from './extensions/command_handler';
    Handler(client);

    client.on('messageCreate', async (message) => {

        if ((message.content.split(' '))[0] === `<@${client.user!.id}>`) 
            message.channel.send(`> Hello, my prefix is \`"${prefix}"\`.`);
        if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) 
            return;
        
        const args = message.content.substring(prefix.length).split(" ");
        const cmd = client.commands.get(args[0].toLowerCase()) 
            || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        if (cmd) cmd.default.run(client, message, args.slice(1));
    });

    client.login(process.env.TOKEN); 