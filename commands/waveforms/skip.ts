   
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

                } else if (queue.songs[0] && u_channel === b_channel) {

                    let merged_queue = [...queue.previousSongs, ...queue.songs];
                    let current_track = merged_queue.indexOf(queue.songs[0]);

                    if (!args[0]) {

                        let current_track_in = queue.songs[0];
                        queue.songs[1] || queue.autoplay ? queue.skip() : queue.seek(current_track_in.duration);
    
                        const main = new Discord.MessageEmbed()
                            .setDescription(`✦ Skipped ${current_track_in.name.substring(0,59)}.`)
                            .setFooter({ text: `Arkus.wav  •  Skipped by ${message.author.username}   ` })
                            .setColor(colors.blurple as ColorResolvable)
                            .setTimestamp();
                        return message.channel.send({ embeds: [main] });

                    } else if (isNaN(args[0])) {

                        if (['after', 'on'].includes(args[0].toLowerCase())) {

                            // number should be between current timestamp and the song duration
                            let track_length  = queue.songs[0].duration;
                            let current_time  = Math.round(queue.currentTime);

                            
                        }
                        
                        const warn = new Discord.MessageEmbed()
                            .setDescription("\`🏴\` ⟶ You have to enter a number to move forward to.")
                            .setColor(colors.crimson as ColorResolvable);
                        return message.channel.send({ embeds: [warn] })
                            .then(message => { setTimeout(() => { message.delete() }, 5000) });

                    } else {

                        if (current_track + 1 + Number(args[0]) >= merged_queue.length || Number(args[0]) - 1 < 0) {

                            const warn = new Discord.MessageEmbed()
                                .setDescription("\`🏴\` ⟶ You cannot jump beyond the end of the queue.")
                                .setColor(colors.crimson as ColorResolvable);
                            return message.channel.send({ embeds: [warn] })
                                .then(message => { setTimeout(() => { message.delete() }, 5000) });

                        } else {
                            
                            queue.jump(+args[0]);
                            const main = new Discord.MessageEmbed()
                                .setDescription(`✦ Skipped forward \`${args[0]}\` tracks to Track \`${(current_track + 1) +  Number(args[0])}\`.`)
                                .setFooter({ text: `Arkus.wav  •  Skipped by ${message.author.username}   ` })
                                .setColor(colors.blurple as ColorResolvable)
                                .setTimestamp();
                            return message.channel.send({ embeds: [main] });
                        }
                    }
                }
            
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['s', 'n', 'next'],

        usage: "Skips the current track. Add a number parameter to skip forward that many tracks.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
