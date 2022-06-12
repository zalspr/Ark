   
    import Discord, { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            const pn_embed = new Discord.MessageEmbed()
                .setDescription('\`🎮 Pinging...\`')
                .setColor(message.guild!.me!.displayHexColor);

            const msg = await message.reply({ allowedMentions: { repliedUser: false }, 
                embeds: [pn_embed] });
            msg.edit({ allowedMentions: { repliedUser: false }, 
                embeds: [
                   pn_embed.setDescription(
                      `\`🎮 Pong!~  ⟶  ◽ Latency: ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\``)
                ]
            });
        },

        name:  __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['lat', 'latency'],

        usage: "Fetches the ping between Arkus and the server.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
