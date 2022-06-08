   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import { colors } from '../../databases/customs.json';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {
           
            try {
                
                const b_channel = message.guild?.me?.voice.channel;
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

                } else if (queue.paused) {

                    const warn = new Discord.MessageEmbed()
                        .setDescription("\`🏴\` ⟶ The queue is already paused.")
                        .setColor(colors.crimson as ColorResolvable);
                    return message.channel.send({ embeds: [warn] })
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });
                    
                } else if (u_channel === b_channel) {
                    
                    queue.pause();
                    message.react('⏸');
                }
            
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.split(/[\\/]/).pop()!}\n`, err);
            }
        },

        name: __filename.split(/[\\/]/).pop()!.split('.').shift(),
        alias: ['pa', 'wait'],

        usage: "Pauses the queue.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };