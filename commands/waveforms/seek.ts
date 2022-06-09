   
    import Discord, { ColorResolvable, Message } from 'discord.js';
    import SuperClient from '../../extensions/super_client';
    import { colors } from '../../databases/customs.json';

    function Splitter(str: string) : number[] {

        if (!isNaN(Number(str.replace(/ /g, '')))) 
            return str.split(' ').map(Number);
        
        str = str.replace(/ /g, '').toLowerCase();
        if (str.match(/^[0-9:]+$/))
            return str.split(':').filter(n => n).map(Number);

        if (str.match(/^[0-9,]+$/))
            return str.split(',').filter(n => n).map(Number);

        if (str.match(/^[0-9dhms]+$/)) {

            let time = {} as any;
            time["d"] = 0, time["h"] = 0, time["m"] = 0, time["s"] = 0;
            for (let i = 0; i < str.length; i++) {

                if (str[0].match(/[dhms]/g)) 
                    str = str.substring(1);
                if (str[i].match(/[dhms]/g)) {
                    time[str[i]] = +str.substring(0, i);
                    str = str.substring(i + 1);
                    i = 0;
                }
            }

            return Object.values(time);
        }

        return [-1];
    }

    function ToSeconds(arr: number[]): number {

        if (arr[0] == -1 || arr.length > 4) return -1;

        arr.reverse();
        let seconds = arr[0];
        seconds += arr[1] * 60;
        seconds += arr[2] * 60 * 60;
        seconds += arr[3] * 60 * 60 * 24;

        return seconds;
    }

    function Pad(n : number): string {
        return (n < 10) ? ("0" + n) : n.toString();
    }

    function ToLiteral(num : number) : string {
            
        if (num < 60) 
            return `00:${Pad(num)}`;
        if (num < (60 * 60)) 
            return `${Pad(Math.floor(num / 60))}:${Pad(num % 60)}`;
        if (num < (60 * 60 * 24)) 
            return `${Pad(Math.floor(num / 3600))}:${Pad(Math.floor(num % 3600 / 60))}
            :${Pad(num % 60)}`;
        return `${Pad(Math.floor(num / 86400))}:${Pad(Math.floor(num % 86400 / 3600))}
            :${Pad(Math.floor(num % 3600 / 60))}:${Pad(num % 60)}`;
    }

    export default {
        run: async (client : SuperClient, message: Message, args: any[]) => {
           
            try {

                const b_channel = message.guild?.me?.voice.channel;
                const u_channel = message.member?.voice?.channel;

                if (!u_channel) return message.channel.send('> You must be in a voice channel to use this command.')
                    .then(message => { setTimeout(() => { message.delete() }, 5000) });

                let queue = client.distube.getQueue(message);
                if (!queue) {

                    const warn = new Discord.MessageEmbed()
                        .setDescription("\`🏴\` ⟶ No tracks in queue.")
                        .setColor(colors.crimson as ColorResolvable);
                    return message.channel.send({ embeds: [warn] })
                        .then(message => { setTimeout(() => { message.delete() }, 5000) });

                } else if (u_channel === b_channel) {
                    
                    let track_length  = queue.songs[0].duration;
                    let current_time  = Math.round(queue.currentTime);
                    let timestamp = current_time;

                    if (args[0] && !isNaN(args[1])) {

                        if (["forward", "f"].includes(args[0].toLowerCase())) {
                            
                            if (current_time + Number(args[1]) > track_length) 
                                return message.channel.send('> You cannot seek forward past the end of the track.');
                            timestamp = current_time + Number(args[1]);
                            
                        } else if (["backward", "b"].includes(args[0].toLowerCase())) {
                                
                            if (current_time - Number(args[1]) < 0) 
                                return message.channel.send('> You cannot seek backward past the beginning of the track.');
                            timestamp = current_time - Number(args[1]);
                        } 

                    } else if (["start", 's'].includes(args[0].toLowerCase())) {
                        timestamp = 1;

                    } else if (["middle", "m"].includes(args[0].toLowerCase())) {
                        timestamp = Math.round(track_length / 2);
                    
                    } else {

                        if (!isNaN(args[0]) && args.length == 1) {
                            timestamp = args[0];
                        
                        } else {

                            let content = message.content;
                            content = content.substring(content.indexOf(' ') + 1).replace(/\s+/g, '');

                            timestamp = ToSeconds(Splitter(content));
                            if (timestamp === -1) {

                                const warn = new Discord.MessageEmbed()
                                    .setDescription("\`🏴\` ⟶ Invalid time format.")
                                    .setColor(colors.crimson as ColorResolvable);
                                return message.channel.send({ embeds: [warn] })
                                    .then(message => { setTimeout(() => { message.delete() }, 5000) });

                            } else if (timestamp < 0 || track_length < timestamp) {
                                    
                                const warn = new Discord.MessageEmbed()
                                    .setDescription("\`🏴\` ⟶ Time argument exceeds the track length.")
                                    .setColor(colors.crimson as ColorResolvable);
                                return message.channel.send({ embeds: [warn] })
                                    .then(message => { setTimeout(() => { message.delete() }, 5000) });
                            }
                        }
                    }

                    if (track_length > timestamp && timestamp > 0) {

                        queue.seek(timestamp);
                        const main = new Discord.MessageEmbed()
                            .setDescription(`✦ Seeking to \`${ToLiteral(timestamp)}\`.`)
                            .setColor(colors.blurple as ColorResolvable)
                            .setFooter({ text: `Arkus.wav  •  Requested by ${message.author.username}   ` })
                            .setTimestamp();
                        return message.channel.send({ embeds: [main] });

                    } else {
                            
                        const warn = new Discord.MessageEmbed()
                            .setDescription("\`🏴\` ⟶ Invalid arguments.")
                            .setColor(colors.crimson as ColorResolvable);
                        return message.channel.send({ embeds: [warn] })
                            .then(message => { setTimeout(() => { message.delete() }, 5000) });
                    }
                }
            
            } catch(err) {
                console.log(`  ❱❱ There was an error at ${__filename.substring(__dirname.length + 1)}\n`, err);
            }
        },

        name: __filename.substring(__dirname.length + 1).split(".")[0],
        alias: ['forward'],

        usage: "Seeks forward in seconds.",
        categ: (__dirname.split(/[\\/]/).pop()!).toUpperCase(),
        status: 'ACTIVE',
        extend: false
   };
