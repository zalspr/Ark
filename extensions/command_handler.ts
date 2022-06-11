    
    import { Client } from 'discord.js';
    import fs, { Dirent } from 'fs';

    const GetFiles = (dir: string, suffix: string, client: any) => {

        const master : Dirent[] = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of master) {

            if (file.isDirectory()) {
                let name = file.name.charAt(0).toUpperCase() + file.name.slice(1);

                // Maintenance
                let ignore = fs.readFileSync(`./databases/maintenance.txt`).toString().split(', ');
                if (ignore.includes(name)) 
                    continue;

                if (fs.readdirSync(`${dir}/${file.name}`).filter(f => f.endsWith('.js') || f.endsWith('.ts')).length === 0) {
                    console.log(`  ❱❱ No commands in the ${name} folder to load.`);
                } else {
                    console.log(`  ❱❱ Loading files from the ${name} folder...`);
                    client.categories.push(name);
                    GetFiles(`${dir}/${file.name}`, suffix, client);
                }

            } else if (file.name.endsWith(suffix)) {
                const command = require(`../${dir}/${file.name}`);
                const command_name = file.name.substring(0, file.name.indexOf('.'));

                if (client.commands.has(command_name)) {
                    console.log(`     [!] The command "${command_name}" has already been loaded.`);
                } else {
                    client.commands.set(command_name, command);
                }

                if (!command.default.alias) continue;
                for (const alias of command.default.alias) {
                    if (client.aliases.has(alias)) {
                        console.log(`     [!] The alias "${alias}" of "${command_name}" has already been loaded.`);
                    } else {
                        client.aliases.set(alias, command_name);
                    }
                }
            }
        }
    };

    export default (client: Client) => {
        GetFiles('commands', '.ts', client);
    };