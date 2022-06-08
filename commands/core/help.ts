   
    import Discord, { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import Extender from '../../extensions/extenders';

    import { prefix } from '../../databases/preferences.json';
    const EmojiMap = require('../../databases/emoji_map.json');

    function get_cmds (client: SuperClient, filter: string): string {

        let command: string = '';
        for (const [key, value] of client.commands) {
            if (value.default.status === 'DEPRECATED') continue;
            if (value.default.categ.toLowerCase() === filter.toLowerCase())
                command += `\`${prefix + key}\` `;
        }

        return command ? command : 'No commands found.';
    }

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            let cmd = client.commands.get(args[0]) || client.aliases.get(args[0]);
            if (args[0] && !cmd) {
                message.reply({ allowedMentions: { repliedUser: false }, content: `\`${args[0]}\` is not a valid argument.`});    
                return;
            }

            const hpex_embed = new Discord.MessageEmbed()
                .setColor(message.guild!.me!.displayHexColor)
                .setFooter({ text: `Arkus Commands  •  Requested by ${message.author.username}.`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            if (cmd) {

                if (cmd.default) cmd = cmd.default;
                const alpha_w = cmd.status === 'ALPHA' ? '[Alpha Only]' : '';
                hpex_embed.setTitle(prefix + cmd.name + ' ' + alpha_w);
                
                if (cmd.extend) Extender.extend(cmd, hpex_embed, args[0]);
                else hpex_embed.setDescription(`> **${cmd.usage}** \n> \`🤖\` Aliases: \`${(cmd.alias).toString().replace(/,/g, '` `')}\``);

            } else if (!args[0]) {

                hpex_embed.setAuthor({ name: 'Arkus Commands', iconURL: 'https://i.imgur.com/o1jRjHA.gif' })
                .setDescription(`Arkus' default prefix is \`${prefix}\`. Note that all commands are experimental and only few work smoothly as of the moment.`)
                .setThumbnail(message.guild!.iconURL()!);

                for (const category of client.categories) {
                    hpex_embed.addField(`\`${EmojiMap[category.toLowerCase()] ? EmojiMap[category.toLowerCase()] : 
                        '🏴'}\` ${category}`, get_cmds(client, category));
                }

                hpex_embed.addField('\u200b', `Type \`${prefix}help\` \`command\` to view the details of the command.`);
            }
            
            message.reply({ allowedMentions: { repliedUser: false }, embeds: [hpex_embed] });
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['h', 'commands', 'cmd'],

        usage: "Lists all the commands supported by the bot.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
