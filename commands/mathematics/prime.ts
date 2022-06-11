   
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
                    content: "> Input only one numerical value." });

            } else if (args[0] <= 0) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> Must be a positive number greater than one." });

            } else if (args[0] % 1) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> Must be a whole number." });

            } else {

                if (MathFunctions.prime(args[0]) && args[0] != 1) {

                    return message.reply({ allowedMentions: { repliedUser: false }, 
                        content: `\`\`\`py\n✦ The number ${args[0]} is a prime.\`\`\`` });

                } else { 
                    
                    return message.reply({ allowedMentions: { repliedUser: false }, 
                        content: `\`\`\`py\n✦ The number ${args[0]} is not a prime.\`\`\`` });
                }
            }
        },

        name: __filename.split(/[\\/]/).pop()!.split('.').shift(),
        alias: ['pr'],

        usage: "Returns if a number is prime or not.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };