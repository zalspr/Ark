   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import { colors } from '../../databases/customs.json';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {
           
            try {
                
                const b_channel = message.guild?.me?.voice.channel;
                const u_channel = message.member?.voice?.channel;

                if (!u_channel) return message.channel.send('> You must be in a voice channel to use this command.')
                    .then(message => { setTimeout(() => { message.delete() }, 5000) });

                let queue = client.distube.getQueue(message);
                if (!queue) {

                    const warn = new Discord.MessageEmbed()
                        .setDescription("\`🏴\` ⟶ No tracks in queue.")
                        .setColor(colors.crimson as ColorResolvable);
                    return message.channel.send({ embeds: [warn] })
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });

                } else if (args[0] && !isNaN(args[0]) && args[0] <= 100 && args[0] >= 0 && u_channel === b_channel) {

                    queue.setVolume(Number(args[0]));
                    const main = new Discord.MessageEmbed()
                        .setDescription(`✦ Volume now set to \`${args[0]}\`.`)
                        .setColor(colors.blurple as ColorResolvable)
                        .setFooter({ text: `Arkus.wav  •  Modified by ${message.author.username}   ` })
                        .setTimestamp();
                    return message.channel.send({ embeds: [main] });
                    
                } else {
                    
                    const warn = new Discord.MessageEmbed()
                        .setDescription("\`🏴\` ⟶ Invalid arguments.")
                        .setColor(colors.crimson as ColorResolvable);
                    return message.channel.send({ embeds: [warn] })
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });
                }
        
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['vol'],

        usage: "Controls the volume of the queue.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
