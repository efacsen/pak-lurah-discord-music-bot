export default {
    name: 'interactionCreate',
    async execute(interaction) {
        // Only handle slash commands
        if (!interaction.isChatInputCommand()) return;

        console.log(`[Command] ${interaction.user.tag} used /${interaction.commandName} in ${interaction.guild?.name}`);

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`❌ No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
            console.log(`[Command] /${interaction.commandName} executed successfully`);
        } catch (error) {
            console.error(`❌ Error executing ${interaction.commandName}:`, error);

            const errorMessage = {
                content: '❌ There was an error executing this command!',
                ephemeral: true
            };

            // Handle different interaction states
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
