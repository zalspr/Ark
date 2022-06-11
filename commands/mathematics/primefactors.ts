   
    import { Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import MathFunctions from '../../extensions/math_functions';

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            if (args.some(isNaN)) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Invalid input.** Must be a numerical value." });

            } else if (args.length > 1) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Invalid input.** Input only one value." });

            } else if (args[0] > 1000 && args[0] <= 3) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Invalid input.** Must be a number between 3 and 1000." });

            } else {

                let prime_factors = MathFunctions.factors(args[0]).filter(f => MathFunctions.prime(f)).join(", ");
                let content = `\`\`\`q\n✦ Prime Factors of ${args[0]}: ${prime_factors}\`\`\``;
                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: content.substring(0, 2000) });
            }
        },

        name: __filename.split(/[\\/]/).pop()!.split('.').shift(),
        alias: ['pf', 'pfct'],

        usage: "Returns a list of prime factors of a given input.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };