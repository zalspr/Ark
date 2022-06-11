   
    import { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {
           
            try {
                
                const b_channel = message.guild?.me?.voice.channel;
                const u_channel = message.member?.voice?.channel;
                
                if (!b_channel) return message.channel.send('> I am not in a voice channel.')
                    .then(message => { setTimeout(() => { message.delete() }, 5000) });

                if (b_channel === u_channel
                    || b_channel.members.filter(m => !m.user.bot).size === 0) {
                    
                    client.distube.voices.leave(message);
                    message.react('👍');
                }
            
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['dc', 'die', 'stop'],

        usage: "Cleares the queue and leaves the voice channel.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
