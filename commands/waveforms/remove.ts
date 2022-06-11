   
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

                } else if (u_channel === b_channel) {

                    let merged_queue = [...queue.previousSongs, ...queue.songs];
                    let current_track = (merged_queue.indexOf(queue.songs[0]));
                    let track_index = args[0] <= 1 ? -1 : args[0] - 1;

                    if (isNaN(args[0]) || args[0] > merged_queue.length || args[0] < 0 || track_index === current_track) {

                        const warn = new Discord.MessageEmbed()
                            .setDescription("\`🏴\` ⟶ Invalid arguments.")
                            .setColor(colors.crimson as ColorResolvable);
                        return message.channel.send({ embeds: [warn] })
                            .then(message => { setTimeout(() => { message.delete() }, 5000) });
                
                    } else {
                        
                        let track = merged_queue[track_index];            
                        if (args[0] > current_track) {
                            queue.songs.splice(args[0] - 1 - current_track, 1);
                        } else if (args[0] < current_track) {
                            queue.previousSongs.splice(track_index, 1);
                        }

                        const main = new Discord.MessageEmbed()
                            .setDescription(`✦ Removed track [${track.name}](${track.url})`)
                            .setColor(colors.crimson as ColorResolvable)
                            .setFooter({ text: `Arkus.wav  •  Removed by ${message.author.username}   ` })
                            .setTimestamp();
                        return message.channel.send({ embeds: [main] });
                    }
                }
            
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['rmv'],

        usage: "Removes a track off the queue given their index.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
