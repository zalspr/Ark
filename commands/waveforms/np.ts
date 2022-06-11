   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import { colors } from '../../databases/customs.json';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {
           
            try {
                
                const u_channel = message.member?.voice?.channel;
                if (!u_channel) return message.channel.send('> You must be in a voice channel to use this command.')
                    .then(message => { setTimeout(() => { message.delete() }, 5000) });

                let queue = client.distube.getQueue(message);
                if (!queue) {        

                    const no_embed = new Discord.MessageEmbed()
                        .setDescription("\`🏴\` ⟶ No tracks in queue.")
                        .setColor(colors.crimson as ColorResolvable);
                    return message.channel.send({ embeds: [no_embed] })
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });

                } else if (queue.songs[0]) {

                    let current_track = queue.songs[0];
                    let timestamp = Math.round((queue.currentTime / current_track.duration) * 50);
                    let text_length = current_track.name?.substring(59);

                    let progress_bar = "─────────────────────────────────────────────────";
                    progress_bar = progress_bar.substring(0, timestamp) + "🔹" + progress_bar.substring(timestamp + 1);

                    let play_card = `[<@${current_track.user?.id}>]  •  [${text_length}](${current_track.url}) 
                        \n\`${progress_bar} ${queue.formattedCurrentTime} / ${current_track.formattedDuration}\``;

                    const np_embed = new Discord.MessageEmbed()
                        .setDescription(play_card)
                        .setColor(colors.blurple as ColorResolvable)
                        .setFooter({ text: `Arkus.wav  •  Requested by ${message.author.username}   ` })
                        .setTimestamp();
                    return message.channel.send({ embeds: [np_embed] });
                }
            
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['nowplaying', 'current'],

        usage: "Returns the current track being played.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
