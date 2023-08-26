const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const inventoryViewer = require('mineflayer-web-inventory')

const chat = require("./components/chat.js")

if (process.argv.length < 4 || process.argv.length > 6) {
    console.log('Usage : node bot.js <host> <port> [<name>] [<password>]')
    process.exit(1)
}

const bot = mineflayer.createBot({
    host: process.argv[2],
    port: parseInt(process.argv[3]),
    username: process.argv[4] ? process.argv[4] : 'bot',
    password: process.argv[5]
})

bot.once('spawn', () => {
    mineflayerViewer(bot, { port: 3001, firstPerson: true })
    mineflayerViewer(bot, { port: 3002, firstPerson: false })
    inventoryViewer(bot)
})

chat.registerChatCommands(bot)

// DEBUG
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))