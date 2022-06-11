   
    import { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {
           
            try {

                const b_channel = message.guild?.me?.voice.channel;
                const u_channel = message.member?.voice?.channel;
                
                if (!u_channel) return message.channel.send('> You must be in a voice channel to use this command.')
                    .then(message => { setTimeout(() => { message.delete() }, 5000) });

                let queue = client.distube.getQueue(message);
                if (queue && b_channel !== u_channel) {

                    message.guild?.me?.voice.setChannel(u_channel);
                    message.react('👍');
                    
                } else if (b_channel === u_channel) {
                    
                    message.react('❔');

                } else {

                    client.distube.voices.join(u_channel);
                    message.react('👍');
                }
            
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['enter'],

        usage: "Enters the user's voice channel.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
