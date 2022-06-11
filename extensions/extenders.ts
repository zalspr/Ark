
    import Discord from 'discord.js';

    export default {
        extend: (cmd: any, embed: Discord.MessageEmbed, type: string) => {

        switch (type) {
            case 'math':
                let extended = "The math command uses the `mathjs` package's functions to evaluates given expressions. This creates a flexible calculator that can be used within Discord.";
                let example = "✦ Basic Expressions: Add [+], Subtract [-], Multiply [∗], Divide[/] \n"
                + "✦ Exponents [^2] and Square Roots [sqrt(2)] \n" 
                + "✦ Logarithmic Functions [log(2)] \n"
                + "✦ Trigonometry: Sine [sin(2)], Cosine [cos(2)], Tangent[tan(2)] \n"
                + "✦ Measurement Conversion: 2inch to cm, 4km to miles, etc. \n"
                + "✦ Complex Expressions, and more." ;

                embed.setDescription(`> **${cmd.usage}** \n> ${extended}`)
                .addFields(
                    { name: `\`🤖\` Aliases: \`${(cmd.alias).toString().replace(/,/g, '` `')}\`  •  \`🏴\` Arguments: \`No limit\``, value: '\u200b'},
                    { name: `\`This command supports arguments such as:\``, value: example},
                    { name: '\u200b', value: '**Note:** Type the expression in code syntax to avoid errors.'});
            break;

            default:
            break;
        };  
        }
    };
