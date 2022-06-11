
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import DisTube, { Queue, Song, Playlist, SearchResult } from 'distube';
    import { colors, filters } from '../databases/customs.json';
    import SuperClient from './super_client';

    import { YtDlpPlugin } from '@distube/yt-dlp';
    import { SpotifyPlugin } from '@distube/spotify';
    import { SoundCloudPlugin } from '@distube/soundcloud';

    export default async (client: SuperClient) => {
        
        client.distube = new DisTube(client, { 
            searchSongs: 10, emitNewSongOnly: false, youtubeDL: false,
            plugins: [
                new SpotifyPlugin({ emitEventsAfterFetching: true }),
                new SoundCloudPlugin(),
                new YtDlpPlugin()
            ],
            updateYouTubeDL: false,
            customFilters: filters
        });

        client.distube
        .on('playSong', async (queue: Queue, song: Song) => { 

            try {

                let now_playing = song.name?.substring(0, 59);
                queue.textChannel?.messages.fetch({ limit: 1 })
                    .then(async (messages: Discord.Collection<string, Message>) => {

                    let last_user = messages.first()!;
                    const main = new Discord.MessageEmbed()
                        .setDescription(`Now playing: [${now_playing}](${song.url})  •  [<@${song.user?.id}>]`)
                        .setFooter({ text: `Arkus.wav  •  Queued by ${song.user!.username}   ` })
                        .setColor(colors.blurple as ColorResolvable)
                        .setTimestamp();

                    if (last_user.author.id === client.user?.id && last_user.embeds[0].description?.includes("Now playing")) {
                        last_user.edit({ embeds: [main] });
                    } else {
                        queue.textChannel?.send({ embeds: [main] });
                    }
                });
                
            } catch(err) {
                console.log("  ❱❱ There was an error on [Event Listener: \"playSong\"].\n", err);
            }
        })

        .on('addSong', async (queue: Queue, song: Song) => {

            try {

                let now_playing = song.name?.substring(0, 59);
                queue.textChannel?.messages.fetch({ limit: 1 })
                    .then(async (messages: Discord.Collection<string, Message>) => {

                    let last_user = messages.first()!;
                    const main = new Discord.MessageEmbed()
                        .setDescription(`Queued [${now_playing}](${song.url})`)
                        .setFooter({ text: `Arkus.wav  •  Queued by ${song.user!.username}   ` })
                        .setColor(colors.blurple as ColorResolvable)
                        .setTimestamp();

                    if (last_user.author.id === client.user?.id && last_user.embeds[0].description?.includes("Queued")) {
                        last_user.edit({ embeds: [main] });
                    } else {
                        queue.textChannel?.send({ embeds: [main] });
                    }
                });

            } catch(err) {
                console.log("  ❱❱ There was an error at on [Event Listener: \"addSong\"].\n", err); 
            }
        })

        .on("addList", async (queue: Queue, playlist: Playlist) => {

            try {

                let playlist_name = playlist.name.substring(0, 39);
                const main = new Discord.MessageEmbed()
                    .setDescription(`Added playlist [${playlist_name}](${playlist.url}) [+${playlist.songs.length} tracks]`)
                    .setFooter({ text: `Arkus.wav  •  Added by ${playlist.user!.username}   ` })
                    .setColor(colors.mahogany as ColorResolvable)
                    .setTimestamp();
                queue.textChannel?.send({ embeds: [main] });

            } catch(err) {
                console.log("  ❱❱ There was an error on [Event Listener: \"addList\"].\n", err);
            }
        })

        .on("noRelated", async (queue: Queue) => {

            try {

                const main = new Discord.MessageEmbed()
                    .setDescription(`✦ Can't find any related music.`)
                    .setColor(colors.crimson as ColorResolvable);
                queue.textChannel?.send({ embeds: [main] });

            } catch(err) {
                console.log("  ❱❱ There was an error [Event Listener: \"noRelated\"].\n", err);
            }
        })

        .on('finish', async (queue: Queue) => {

            try {

                const finish_embed = new Discord.MessageEmbed()
                    .setDescription(`✦ No more tracks left in queue.`)
                    .setColor(colors.crimson as ColorResolvable);
                queue.textChannel?.send({ embeds: [finish_embed] });

            } catch(err) {
                console.log("  ❱❱ There was an error at [Event Listener: \"finish\"].\n", err);
            }
        })

        .on("initQueue", queue => {

            queue.autoplay = false;
            queue.volume = 100;
            queue.repeatMode = 0;
        })

        .on("error", (channel, err: Error) => {

            const error_embed = new Discord.MessageEmbed()
                .setDescription(`✦ An error occurred.`)
                .setColor(colors.crimson as ColorResolvable);
            channel.send({ embeds: [error_embed] });

            console.log("  ❱❱ Error detected on distube_handler.ts.\n", err);
        })

        // .on("searchNoResult", async (message: Message, query: string) => {
        //     // code here
        // })
        // .on("searchResult", async (message: Message, result: SearchResult[], query: string,) => {
        //     // code here
        // })
        // .on("searchCancel", async (message: Message, query: string) => { 
        //     // code here
        // })
        // .on("searchInvalidAnswer", async (message: Message, answer: Message, query: string) => {
        //     // code here
        // })
        // .on("searchDone", async (message: Message, answer: Message, query: string) => {
        //     // code here
        // })
    }
