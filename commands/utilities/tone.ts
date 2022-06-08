   
    import { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            const tones = ["/j", "/hj", "/srs", "/nm", "/pos", "/neg", "/gen", "/th", "/s", "/r"];
            const random = Math.floor(Math.random() * tones.length);
            message.reply({ allowedMentions: { repliedUser: false }, content: tones[random] });
        },

        name: __filename.split(/[\\/]/).pop()!.split('.').shift(),
        alias: ['tones', 'ti'],

        usage: "Returns a random tone indicator.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };