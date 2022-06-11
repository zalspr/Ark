   
    import { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import MathFunctions from '../../extensions/math_functions';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            if (args.some(isNaN)) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Invalid input.** Must be a numerical value." });
                    
            } else if (args.length <= 1) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Invalid input.** Must input two values." });

            } else if (args.length >= 30) {

                message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Reached maximum of 30 arguments.**" });

            } else {

                let content = `\`\`\`q\n✦ The GCD of [${args.join(', ')}] is ${MathFunctions.gcd(args)}.\`\`\``;
                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: content.substring(0, 2000) });
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['gcdivisor'],

        usage: "Returns the greatest common divisor between two inputs.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };