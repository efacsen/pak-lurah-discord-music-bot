import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { YtDlpExtractor } from './extractors/YtDlpExtractor.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ]
});

// Initialize command collection
client.commands = new Collection();

// Initialize discord-player
const player = new Player(client, {
    skipFFmpeg: false, // Always use FFmpeg for better compatibility
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

// Register YtDlp extractor for YouTube
await player.extractors.register(YtDlpExtractor, {});

// Register all default extractors (SoundCloud, Spotify, etc.)
await player.extractors.loadMulti(DefaultExtractors);

// Enable debug logging to monitor player activity
player.on('debug', (message) => {
    console.log(`[Player Debug] ${message}`);
});

player.events.on('debug', (queue, message) => {
    console.log(`[Queue Debug] ${message}`);
});

// Error handlers
player.events.on('playerError', (queue, error) => {
    console.error(`[Player Error] ${error.message}`);
    queue.metadata.channel.send(`❌ Error playing track: ${error.message}`);
});

player.events.on('error', (queue, error) => {
    console.error(`[Queue Error] ${error.message}`);
    queue.metadata.channel.send(`❌ Queue error: ${error.message}`);
});

// Player event handlers
player.events.on('playerStart', (queue, track) => {
    console.log(`▶️ Now playing: ${track.title}`);
    queue.metadata.channel.send(`▶️ Now playing: **${track.title}**`);
});

player.events.on('audioTrackAdd', (queue, track) => {
    console.log(`➕ Added to queue: ${track.title}`);
    queue.metadata.channel.send(`➕ Added to queue: **${track.title}**`);
});

player.events.on('disconnect', (queue) => {
    console.log('👋 Disconnected from voice channel');
    queue.metadata.channel.send('👋 Disconnected from voice channel!');
});

player.events.on('emptyChannel', (queue) => {
    console.log('🚪 Voice channel is empty, leaving...');
    queue.metadata.channel.send('🚪 Leaving voice channel due to inactivity...');
});

player.events.on('emptyQueue', (queue) => {
    console.log('✅ Queue finished');
    queue.metadata.channel.send('✅ Queue finished!');
});

player.events.on('error', (queue, error) => {
    console.error(`❌ Player error: ${error.message}`);
    queue.metadata.channel.send(`❌ An error occurred: ${error.message}`);
});

// Load command files dynamically
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(`file://${filePath}`);

    if ('data' in command.default && 'execute' in command.default) {
        client.commands.set(command.default.data.name, command.default);
        console.log(`✅ Loaded command: ${command.default.data.name}`);
    } else {
        console.warn(`⚠️ Command at ${file} is missing required "data" or "execute" property.`);
    }
}

// Load event files dynamically
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = await import(`file://${filePath}`);

    if (event.default.once) {
        client.once(event.default.name, (...args) => event.default.execute(...args));
    } else {
        client.on(event.default.name, (...args) => event.default.execute(...args));
    }
    console.log(`✅ Loaded event: ${event.default.name}`);
}

// Login to Discord
client.login(process.env.DISCORD_CLIENT_TOKEN);
