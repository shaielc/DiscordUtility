require('dotenv/config');
const { Client, Collection, Events, REST, Routes, GatewayIntentBits, ChannelType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const { SlashCommandBuilder } = require('discord.js');
const clientId = process.env["CLIENT_ID"];
const token = process.env["TOKEN"];
    
const rest = new REST({ version: '10' }).setToken(token);


command = {
	data: new SlashCommandBuilder()
		.setName('tempvc')
		.setDescription('creates a temp VC').addStringOption(
            option => option.setName('name').setDescription("Name of the temp channel").setRequired(true)),
	async execute(interaction) {
        const name =  interaction.options.getString('name');
        const channel = await interaction.guild.channels.create({name, type: ChannelType.GuildVoice, });
		await interaction.reply(`Created temp channel <#${channel.id}>`);
	},
}

client.commands = new Collection();
client.commands.set(command.data.name, command);

async function registerCommands(commands, ) {
    commands_register_data = commands.map((cmd) => cmd.data.toJSON());
    try {
        console.log(`Started refreshing ${commands_register_data.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(clientId,),
            { body: commands_register_data },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
}
registerCommands(client.commands);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command =  interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.warn(`No command matching ${interaction.commandName} was found.`);
        return
    }
    try {
        
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

})

async function checkTempChannel(channelId) {
    const vc = client.channels.cache.get(channelId);
    if (!vc) {
        return
    }
    if (!vc.members.size) {
        vc.delete("Empty channel");
    }
}

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    await checkTempChannel(oldState.channelId);
})
const http = require('http');
function handleRequest(request, response) {
    response.end('Some Response at ' + request.url);
}
var server = http.createServer(handleRequest);
server.listen(8083, function() {
    console.log('Listening...')
})
client.login(token);
