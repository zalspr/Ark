   
    import Discord, { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            if (!message.member!.permissions.has('ADMINISTRATOR')) return;
            if (message.deletable) message.delete();
            
            let slicer = args[0] === '/m' ? 2 : 1; 
            let text = message.content.split(' ').slice(slicer).join(' ');
            text = text.substring(0, 2000);

            if (slicer === 2) {
                const tk_embed = new Discord.MessageEmbed()
                    .setDescription(`**${text}**`)
                    .setColor('#2F3136');
                message.channel.send({ embeds: [tk_embed] });
            } else if (args[0]) {
                message.channel.send(text);
            }
        },

        name:  __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['t', 'say', 'speak'],

        usage: "Returns any message, given an input. Add `/m` to embed.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ALPHA',
        extend: false
   };
