   
    import { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import { evaluate } from 'mathjs';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            try {

                let content = `\`\`\`py\n✦ Result: ${evaluate(args.join(" ").replace(/```/g, ""))}\`\`\``
                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: content.substring(0, 2000) });

            } catch {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: `\`\`\`fix\n✦ Expression calculation failed. Invalid inputs.\`\`\`` })
                    .then(msg => { setTimeout(() => msg.delete(), 5000)});
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['m', 'calc', 'solve'],

        usage: "Evaluates a math expression.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: true
   };