import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const rest = new REST().setToken(process.env.DISCORD_CLIENT_TOKEN);

console.log('🗑️  Clearing all global commands...');

try {
    // Clear global commands
    await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: [] }
    );
    console.log('✅ Successfully cleared all global commands!');
    console.log('   Commands in your guild will still work.');
} catch (error) {
    console.error('❌ Error clearing commands:', error);
}

process.exit(0);
