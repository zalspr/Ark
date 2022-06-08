   
    import Discord, { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            const user = message.mentions.users.first() || message.author;
            const av_embed = new Discord.MessageEmbed()
                .setAuthor({ name: "Requested Avatar:" })
                .setImage(user.avatarURL({ format: 'png', size: 1024 })!)
                .setFooter({ text: `Requested by ${message.author.username}.`, iconURL: message.author.avatarURL()! })
                .setColor(message.guild!.me!.displayHexColor)
                .setTimestamp()

            message.reply({ allowedMentions: { repliedUser: false }, embeds: [av_embed] });
        },

        name: __filename.split(/[\\/]/).pop()!.split('.').shift(),
        alias: ['av', 'pfp', 'dp'],

        usage: "Returns the avatar of a user mentioned, or your own.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };