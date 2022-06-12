   
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

            } else if (!(args[0] > 3 && args[0] % 2 == 0)) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Invalid input.** Must be greater than 3, and an even number." });

            } else if (args[0] > 10000) {

                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: "> **Invalid input.** Must be a number below 10000." });

            } else {

                let number = Number(args[0]), output = '';
                if (number === 4) {
                    output = "✦ 2 & 2";
                } else {
                    for (let i = 3; i < number / 2; i++) 
                    if (MathFunctions.prime(i) && MathFunctions.prime(number - i)) 
                        output += `✦ ${i} & ${number - i}\n`;   
                }

                let content = `\`\`\`q\n> Goldbach Conjecture of ${args[0]}: \n${output}\`\`\``;
                return message.reply({ allowedMentions: { repliedUser: false }, 
                    content: content.substring(0, 2000) });
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['gb', 'gbcj'],

        usage: "Returns a list of two primes that when added, equal to the input.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };