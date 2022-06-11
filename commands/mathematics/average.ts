   
    import { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            if (args.some(isNaN)) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Invalid input.** Must be a numerical value." });

            } else if (args.length <= 1) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> Enter two or more values." });
        
            } else if (args.length >= 30) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Reached maximum of 30 arguments.**" });
            
            } else {

                let average = 0;
                for (const num of args)
                    average += Number(num);
                average /= (args.length);

                let content = `\`\`\`q\n✦ The average of [${args.join(', ')}] is ${average.toFixed(2)}.\`\`\``;
                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: content.substring(0, 2000) });
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['avg', 'mean'],

        usage: "Gets the average of a set of numbers.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };