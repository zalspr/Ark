   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import { colors } from '../../databases/customs.json';
    import { Song } from 'distube';

    function FixBracket(track_name: string) {

        if (track_name!.indexOf(']') < track_name!.indexOf('[')) {
            track_name = track_name?.replace(']', ')');
        } if (track_name!.lastIndexOf('[') > (track_name!.lastIndexOf(']') ? track_name!.lastIndexOf(']') : 0)) {
            track_name = track_name?.substring(0, track_name?.lastIndexOf('[')) + '(' + track_name?.substring(track_name?.lastIndexOf('[') + 1);
        }

        return track_name;
    }

    function GenerateEmbeds (tracks: Song[], current: Song) : Discord.MessageEmbed[] {

        let embeds = [];
        let cur_index = tracks.indexOf(current) % 10;
        let max_page = Math.ceil(tracks.length / 10) + ((cur_index == 9) ? 0 : 1);

        for (let page_start = 0, cur_page = 1, page_limit = cur_index + 1; page_start < tracks.length; page_start = page_limit, page_limit += 10, cur_page++) {

            let page = tracks.slice(page_start, page_limit), j = page_start;  
            let tracklist = '';

            for (const data of page) {

                let track_id = ('0' + (++j).toString()).slice(-2);
                let track_name = data.name?.substring(0, 49);

                track_name = FixBracket(track_name!);
                let temp_tracklist = `\`[${track_id}] ${data.formattedDuration}\`  [${track_name}](${data.url})\n`;

                if (tracklist.length + temp_tracklist.length > 1024) {

                    let left = `\`[${track_id}] ${data.formattedDuration}\`  [`
                    let right = `...](${data.url})\n`;

                    let fix_length = track_name.substring(0, 1024 - tracklist.length - left.length - right.length);
                    tracklist += `${left}${fix_length}${right}`;
                    break;

                } else {
                    tracklist += temp_tracklist;
                }
            }

            tracklist = tracklist.substring(0, 1024);

            let current_id = ('0' + (tracks.indexOf(current) + 1).toString()).slice(-2);
            let current_name = current.name?.substring(0, 49);

            current_name = FixBracket(current_name!);
            let currents = `\`[${current_id}] ${current.formattedDuration}\`  [${current_name}](${current.url})`;

            const queue_embed = new Discord.MessageEmbed()
                .setFooter({ text: `Arkus.wav  •  ${cur_page} / ${max_page}  •  Track ${tracks.indexOf(current) + 1} of ${tracks.length}` })
                .setColor(colors.blurple as ColorResolvable)
                .setTimestamp()
                .addFields(
                    { name: '\`📢\` Now Playing:', value: currents },
                    { name: '\`🔻\` Upcoming:', value: tracklist });
            embeds.push(queue_embed);
        }

        return embeds;
    }

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

                let merged_queue = [...queue.previousSongs, ...queue.songs];
                let current_page = Math.floor((merged_queue.indexOf(queue.songs[0])) / 10) + 1;
                
                const pagination = GenerateEmbeds(merged_queue, queue.songs[0]);
                const main = await message.channel.send({ embeds: [pagination[current_page]] });
            
                try {

                    await main.react("⬅️");
                    await main.react("➡️");

                } catch (err) {
                    console.log(`  ❱❱ There was an error when adding reactions.`);
                }
                
                const filter = (reaction: any, user: { id: string; }) => {
                    return ["⬅️", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
                };
                
                const collector = main.createReactionCollector({ filter, time: 200000 });
                collector.on("collect", async (reaction) => {

                    if (reaction.emoji.name === "➡️" && current_page < pagination.length - 1) {
                        current_page++;

                        main.edit({ embeds: [pagination[current_page]] });
                        reaction.users.remove(message.author.id);

                    } else if (reaction.emoji.name === "⬅️" && current_page > 0) {
                        current_page--;

                        main.edit({ embeds: [pagination[current_page]] });
                        reaction.users.remove(message.author.id);
                    }
                });
                
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['q', 'tracklist', 'tl'],

        usage: "Displays the current queue of tracks.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
