   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';

    function rgbToHex(red: number, green: number, blue: number) {
        return '#' + (0x1000000 + (red << 16) | (green << 8) | (blue << 0)).toString(16).slice(1);
    }
      
    function hexToRgb(hex: string) : any {
        return [Number('0x' + hex[1] + hex[2]) | 0, Number('0x' + hex[3] + hex[4]) | 0, Number('0x' + hex[5] + hex[6]) | 0];
    }

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            if (!args[0]) return message.channel.send('Please provide a color value.');

            let rgb: number[] = [], hex: string = '';
            let input = args[0].replace('#', '');
            let exp = /^([0-9a-f]{3}){1,2}$/i;

            if (exp.test(input) && !args[1]) {

                hex = '#' + (input.length === 3 ? input.replace(/./g, '$&$&') : input);
                rgb = hexToRgb(hex);
                
            } else if (args.length === 3) {

                if (args.some(num => isNaN(num.replace(',', '')) || num > 255 || num < 0)) 
                    return message.channel.send('> Please enter a valid color value.')
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });

                rgb = args.map(num => num.replace(',', ''));
                hex = rgbToHex(rgb[0], rgb[1], rgb[2]);

            } else {

                return message.channel.send('> Please enter a valid color value.')
                    .then(message => { setTimeout(() => { message.delete() }, 5000) });
            }
            
            const canvas = require('canvas').createCanvas(500, 500)
            let ctx = canvas.getContext("2d");
                ctx.fillStyle = hex;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'hue.png');
            const color_embed = new Discord.MessageEmbed()
                .setAuthor({ name: `Arkus.png Color Translation` })
                .setDescription(`\`\`\`css\nhex: [${hex}]\nrgb: [${rgb[0]}, ${rgb[1]}, ${rgb[2]}]\`\`\``)
                .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.avatarURL()! })
                .setThumbnail('attachment://hue.png')
                .setTimestamp()
                .setColor(hex as ColorResolvable);
            message.reply({ allowedMentions: { repliedUser: false }, embeds: [color_embed], files: [attachment] });
        },

        name: __filename.split(/[\\/]/).pop()!.split('.').shift(),
        alias: ['x', 'color', 'col', 'hex'],

        usage: "Returns the color of a given hex value.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };