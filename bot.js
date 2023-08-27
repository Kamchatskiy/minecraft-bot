const process = require('node:process')
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const inventoryViewer = require('mineflayer-web-inventory')
const radarPlugin = require('mineflayer-radar')(mineflayer)
const pathfinder = require('mineflayer-pathfinder').pathfinder
// const Movements = require('mineflayer-pathfinder').Movements
// const { GoalNear } = require('mineflayer-pathfinder').goals

// builder
const { builder } = require('mineflayer-builder')
//
const chat = require('./functions/chat.js')

const radarOptions = {
    host: '0.0.0.0',
    port: '3003',
}

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

bot.loadPlugin(pathfinder)
bot.loadPlugin(builder)

bot.once('spawn', async () => {
    inventoryViewer(bot) // 3000 port
    mineflayerViewer(bot, { port: 3001, firstPerson: true })
    mineflayerViewer(bot, { port: 3002, firstPerson: false })
    radarPlugin(bot, radarOptions) // 3003 port

    bot.on('path_update', (r) => {
        const path = [bot.entity.position.offset(0, 0.5, 0)]
        for (const node of r.path) {
            path.push({ x: node.x, y: node.y + 0.5, z: node.z })
        }
        bot.viewer.drawLine('path', path, 0xff00ff)
    })
})
chat.registerChatCommands(bot)

// DEBUG
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))