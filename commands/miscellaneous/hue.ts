   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';

    function rgbToHex(...args : number[]) : number;
    function rgbToHex(r : number, g : number, b : number) : number {
        return (r & 0xff) << 16 | (g & 0xff) << 8 | (b & 0xff);
    }
      
    function hexToRgb(hex : number) : any {
        return [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff];
    }
    
    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {

            if (!args[0]) return message.channel.send('Please provide a color value.');

            let rgb: number[] = [];
            let hex = 0;
            let input = args[0].replace('#', '');
            let exp = /^([0-9a-f]{3}){1,2}$/i;

            if (exp.test(input) && !args[1]) {

                hex = parseInt(input, 16);
                rgb = hexToRgb(hex);
                
            } else if (args.length === 3) {

                if (args.some(num => isNaN(num.replace(',', '')) || num > 255 || num < 0)) 
                    return message.channel.send('> Please enter a valid color value.')
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });

                rgb = args.map(num => parseInt(num.replace(',', '')));
                hex = rgbToHex(...rgb);

            } else {

                return message.channel.send('> Please enter a valid color value.')
                    .then(message => { setTimeout(() => { message.delete() }, 5000) });
            }
            
            const canvas = require('canvas').createCanvas(500, 500)
            let ctx = canvas.getContext("2d");
                ctx.fillStyle = '#' + hex.toString(16);
                ctx.fillRect(0, 0, canvas.width, canvas.height);

            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'hue.png');
            const color_embed = new Discord.MessageEmbed()
                .setAuthor({ name: `Arkus.png Color Translation` })
                .setDescription(`\`\`\`css\nhex: [${hex.toString(16)}]\nrgb: [${rgb}]\`\`\``)
                .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.avatarURL()! })
                .setThumbnail('attachment://hue.png')
                .setTimestamp()
                .setColor(hex as ColorResolvable);
            message.reply({ allowedMentions: { repliedUser: false }, embeds: [color_embed], files: [attachment] });
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['x', 'color', 'col', 'hex', 'rgb', 'hsl'],

        usage: "Returns the color of a given hex value.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
