   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import { colors, medias } from '../../databases/customs.json';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {
           
            try {
                
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
                }

                let repeat_mode = Number(queue.repeatMode) === 0 ? `off` : Number(queue.repeatMode) === 1 ? `queue` : `track`;
                let current_track = queue.songs[0];

                let merged_queue = [...queue.previousSongs, ...queue.songs];
                let current_id = ('0' + (merged_queue.indexOf(current_track) + 1).toString()).slice(-2);
                
                let status_a = `\`🤖\` **Autoplay:** \`${queue.autoplay ? `on` : `off`}\` \n\n`;
                status_a += `\`💽\` **Elapsed:** \`${queue.formattedCurrentTime}\` \n\n`;
                
                let status_b = `\`📢\` **Playing:** \`${queue.playing}\`\n\n`;
                status_b += `\`🔊\` **Volume:** \`${queue.volume}\` \n\n`;

                let status_c = `\`🔄\` **Looping:** \`${repeat_mode}\` \n\n`;
                status_c += `\`📼\` **Filter:** \`${queue.filters.length > 0 ? queue.filters.join(', ') : `off`}\`\n\n`;
                
                let now_playing = 'Nothing';
                
                if (current_track) {
                    let name = current_track.name?.substring(39);
                    now_playing = `[${name}](${current_track.url})`
                }
                
                const main = new Discord.MessageEmbed()
                    .setAuthor({ name: "Arkus.wav Playback Status", iconURL: medias.rotate})
                    .setDescription(`\`📣 [${current_id}] ${current_track.formattedDuration}\` ${now_playing}`)
                    .setColor(colors.blurple as ColorResolvable)

                    .addField('\u200b', status_a, true)
                    .addField('\u200b', status_b, true)
                    .addField('\u200b', status_c, true)

                    .setFooter({ text: `Arkus.wav  •  Requested by ${message.author.username}   ` })
                    .setTimestamp();
                return message.channel.send({ embeds: [main] }); 
            
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['stat'],

        usage: "Displays the status of the current track.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
