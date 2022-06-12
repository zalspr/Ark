   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import { Colors } from '../../databases/customs.json';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            try {

                const prompt = args.join(" ");
                let queue = client.distube.getQueue(message);

                const b_channel = message.guild?.me?.voice.channel;
                const u_channel = message.member?.voice?.channel;

                if (!u_channel) return message.channel.send('> You must be in a voice channel to use this command.')
                    .then(message => { setTimeout(() => { message.delete() }, 5000) });

                else if (u_channel !== b_channel && queue) {

                    const warn = new Discord.MessageEmbed()
                        .setDescription("\`🏴\` ⟶ I am currently being used on another channel.")
                        .setColor(Colors.crimson as ColorResolvable);
                    return message.channel.send({ embeds: [warn] })
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });

                } else if (args[0]) {

                    client.distube.play(u_channel, prompt, {
                        member: message.member,
                        textChannel: (message.channel as Discord.TextChannel),
                    message });

                } else {

                    const warn = new Discord.MessageEmbed()
                        .setDescription("\`🏴\` ⟶ You must provide a track to play.")
                        .setColor(Colors.crimson as ColorResolvable);
                    return message.channel.send({ embeds: [warn] })
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });
                }

            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['p'],

        usage: "Plays a track, or adds it to the current queue.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
