   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import Extender from '../../extensions/extenders';

    import { Prefix } from '../../databases/preferences.json';
    import { Medias } from '../../databases/customs.json';
    import EmojiMap from '../../databases/emoji_map.json';

    function GetCommands (client: SuperClient, filter: string): string {

        let command = '';
        for (const [key, value] of client.commands) {
            if (value.default.status === 'DEPRECATED') continue;
            if (value.default.categ.toLowerCase() === filter.toLowerCase())
                command += `\`${Prefix + key}\` `;
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
                .setColor(message.guild?.me?.displayHexColor as ColorResolvable)
                .setFooter({ text: `Arkus Commands  •  Requested by ${message.author.username}.`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            if (cmd) {

                if (cmd.default) cmd = cmd.default;
                const alpha_w = cmd.status === 'ALPHA' ? '[Alpha Only]' : '';
                hpex_embed.setTitle(Prefix + cmd.name + ' ' + alpha_w);
                
                if (cmd.extend) {
                    Extender.extend(cmd, hpex_embed, args[0]);
                } else {
                    hpex_embed.setDescription(`> **${cmd.usage}** \n> \`🤖\` Aliases: \`${(cmd.alias).toString().replace(/,/g, '` `')}\``);
                }

            } else if (!args[0]) {

                hpex_embed.setAuthor({ name: 'Arkus Commands', iconURL: Medias.rotate })
                    .setDescription(`Arkus' default prefix is \`${Prefix}\`. Note that all commands are experimental and only few work as it should as of the moment.`)
                    .setThumbnail(message.guild?.iconURL() as string);

                for (const category of client.categories) {
                    hpex_embed.addField(
                        `\`${(EmojiMap as any)[category.toLowerCase()] ? (EmojiMap as any)[category.toLowerCase() as any] : '🏴'}\` ${category}`, 
                        GetCommands(client, category));
                }

                hpex_embed.addField('\u200b', `Type \`${Prefix}help\` \`command\` to view the details of the command.`);
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
