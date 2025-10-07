import { Player } from 'discord-player';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const player = new Player(client);

console.log('=== Discord Player Dependencies Scan ===\n');
const report = await player.scanDeps();
console.log(report);
process.exit(0);
