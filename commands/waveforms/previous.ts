   
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

                } else if (queue.previousSongs.length === 0) {

                    const warn = new Discord.MessageEmbed()
                        .setDescription("\`🏴\` ⟶ There are no previous songs.")
                        .setColor(colors.crimson as ColorResolvable);
                    return message.channel.send({ embeds: [warn] })
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });

                } else if (u_channel === b_channel) {
                    
                    let merged_queue = [...queue.previousSongs, ...queue.songs];
                    let current_track = merged_queue.indexOf(queue.songs[0]);

                    if (!args[0]) {

                        queue.previous();
                        message.react('⏮');

                    } else if (isNaN(args[0])) {
                        
                        const warn = new Discord.MessageEmbed()
                            .setDescription("\`🏴\` ⟶ You have to enter a number to go back to.")
                            .setColor(colors.crimson as ColorResolvable);
                        return message.channel.send({ embeds: [warn] })
                            .then(message => { setTimeout(() => { message.delete() }, 5000) });

                    } else {

                        if (current_track - (Number(args[0]) - 1) <= 0 || Number(args[0]) - 1 < 0) {

                            const warn = new Discord.MessageEmbed()
                                .setDescription("\`🏴\` ⟶ You cannot jump beyond the start of the queue.")
                                .setColor(colors.crimson as ColorResolvable);
                            return message.channel.send({ embeds: [warn] })
                                .then(message => { setTimeout(() => { message.delete() }, 5000) });

                        } else {
                            
                            queue.jump((+args[0] * -1));
                            const main = new Discord.MessageEmbed()
                                .setDescription(`✦ Rewinded back \`${args[0]}\` tracks to Track \`${(current_track + 1) - Number(args[0])}\`.`)
                                .setFooter({ text: `Arkus.wav  •  Rewinded by ${message.author.username}   ` })
                                .setColor(colors.blurple as ColorResolvable)
                                .setTimestamp();
                            return message.channel.send({ embeds: [main] });
                        }
                    }
                }
            
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.split(/[\\/]/).pop()!}\n`, err);
            }
        },

        name: __filename.split(/[\\/]/).pop()!.split('.').shift(),
        alias: ['prev', 'back', 'rewind'],

        usage: "Rewinds to the previous track. Add a number parameter to go back that many tracks.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };