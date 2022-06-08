   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import { colors, medias } from '../../databases/customs.json';
    import { prefix } from '../../databases/preferences.json';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {
           
            try {
                
                const b_channel = message.guild?.me?.voice.channel;
                const u_channel = message.member?.voice?.channel;

                if (!u_channel) return message.channel.send('> You must be in a voice channel to use this command.')
                    .then(message => { setTimeout(() => { message.delete() }, 5000) });

                let queue = client.distube.getQueue(message);
                if (!queue) {

                    const main = new Discord.MessageEmbed()
                        .setAuthor({ name: `Filter Listing`, iconURL: medias.rotate })
                        .setDescription(`Type \`${prefix}filter\` \`name\` toggles the filter. Type it again to turn it off. \nType  \`${prefix}filter\` \`clear\` to remove all filters. Join a voice channel to try it out.`)
                        .addField(`\`📢\`  All Filters`, '`' + Object.keys(client.distube.filters).sort().join('`, `') + '`')
                        .setThumbnail(message.guild!.iconURL()!)
                        .setFooter({ text: `Arkus.wav  •  Requested by ${message.author.username}   `})
                        .setColor(colors.blurple as ColorResolvable)
                        .setTimestamp();
                    return message.channel.send({ embeds: [main] });

                } else if (b_channel === u_channel) {

                    let cur_array = queue.filters.sort();
                    let all_array = Object.keys(client.distube.filters).sort();
                    let rem_array = all_array.filter(filter => !cur_array.includes(filter));

                    const main = new Discord.MessageEmbed()
                        .setFooter({ text: `Arkus.wav  •  Requested by ${message.author.username}   `})
                        .setColor(colors.blurple as ColorResolvable)
                        .setTimestamp();
                    
                    if (!args[0] || args[0] === 'list') {
            
                        main.setAuthor({ name: `Filter Listing`, iconURL: medias.rotate })
                            .setDescription(`Type \`${prefix}filter\` \`name\` toggles the filter. Type it again to turn it off. \nType  \`${prefix}filter\` \`clear\` to remove all filters.`)
                            .addField(`\`📢\`  Supported Filters`, '`' + rem_array.join('`, `') + '`')
                            .addField(`\`📢\`  Applied Filters`, cur_array.length > 0 ? '`' + cur_array.join('`, `') + '`' : '`No filters applied.`')
                            .setThumbnail(message.guild!.iconURL()!);

                    } else if (args.length > 1) {

                        let args_filters = args.filter(filter => all_array.includes(filter));
                        if (args_filters.length === 0) {

                            main.setDescription("✦ Invalid filter.");
                            main.setColor(colors.crimson as ColorResolvable);

                        } else {

                            let description = '';
                            let apply = args_filters.filter(value => rem_array.includes(value));
                            let clear = args_filters.filter(value => cur_array.includes(value));

                            if (apply.length > 0) {
                                description += `✦ Filters \`${apply.join('`, `')}\` has been applied.`;
                            } if (clear.length > 0) {
                                description = description ? description + '\n' : description;
                                description += `✦ Filters \`${clear.join('`, `')}\` has been removed.`;
                            } 
                            
                            main.setDescription(description);
                            queue.setFilter(args_filters);
                        }

                    } else if (all_array.includes(args[0])) {

                        if (rem_array.includes(args[0])) {
                            main.setDescription(`✦ Filter \`${args[0]}\` has been applied.`);
                        } else if (cur_array.includes(args[0])) {
                            main.setDescription(`✦ Filter \`${args[0]}\` has been removed.`);
                        } 
                        
                        queue.setFilter(args[0]);

                    } else if (args[0] === 'clear') {

                        queue.setFilter(false);
                        main.setDescription("✦ All filters have been removed.");

                    } else {

                        main.setDescription("✦ Invalid filter.");
                        main.setColor(colors.crimson as ColorResolvable);
                    }

                    message.channel.send({ embeds: [main] });
                }
                
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.split(/[\\/]/).pop()!}\n`, err);
            }
        },

        name: __filename.split(/[\\/]/).pop()!.split('.').shift(),
        alias: ['filters', 'effects', 'ft'],

        usage: "Adds a sound filter on top of the track.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };