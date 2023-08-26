const mineflayer = require('mineflayer')
const inventoryViewer = require('mineflayer-web-inventory')
const vec3 = require('vec3')

if (process.argv.length < 4 || process.argv.length > 6) {
    console.log('Usage : node digger.js <host> <port> [<name>] [<password>]')
    process.exit(1)
}

const bot = mineflayer.createBot({
    host: process.argv[2],
    port: parseInt(process.argv[3]),
    username: process.argv[4] ? process.argv[4] : 'digger',
    password: process.argv[5]
})

const mineflayerViewer = require('prismarine-viewer').mineflayer
bot.once('spawn', () => {
    mineflayerViewer(bot, { port: 3001, firstPerson: true })
    mineflayerViewer(bot, { port: 3002, firstPerson: false })
})

// Chat commands
bot.on('chat', async (username, message) => {
    if (username === bot.username) return
    switch (message) {
        //web-inventory system
        case 'web-inventory':
            inventoryViewer(bot)
            break

        // movement system
        case 'forward':
            bot.setControlState('forward', true)
            break
        case 'back':
            bot.setControlState('back', true)
            break
        case 'left':
            bot.setControlState('left', true)
            break
        case 'right':
            bot.setControlState('right', true)
            break
        case 'sprint':
            bot.setControlState('sprint', true)
            break
        case 'stop':
            bot.clearControlStates()
            break
        case 'jump':
            bot.setControlState('jump', true)
            bot.setControlState('jump', false)
            break
        case 'jump a lot':
            bot.setControlState('jump', true)
            break
        case 'stop jumping':
            bot.setControlState('jump', false)
            break
        case 'attack':
            entity = bot.nearestEntity()
            if (entity) {
                bot.attack(entity, true)
            } else {
                bot.chat('no nearby entities')
            }
            break
        case 'mount':
            entity = bot.nearestEntity((entity) => { return entity.name === 'minecart' })
            if (entity) {
                bot.mount(entity)
            } else {
                bot.chat('no nearby objects')
            }
            break
        case 'dismount':
            bot.dismount()
            break
        case 'move vehicle forward':
            bot.moveVehicle(0.0, 1.0)
            break
        case 'move vehicle backward':
            bot.moveVehicle(0.0, -1.0)
            break
        case 'move vehicle left':
            bot.moveVehicle(1.0, 0.0)
            break
        case 'move vehicle right':
            bot.moveVehicle(-1.0, 0.0)
            break
        case 'tp':
            bot.entity.position.y += 10
            break
        case 'pos':
            bot.chat(bot.entity.position.toString())
            break
        case 'yp':
            bot.chat(`Yaw ${bot.entity.yaw}, pitch: ${bot.entity.pitch}`)
            break

        // dig system 
        case 'loaded':
            await bot.waitForChunksToLoad()
            bot.chat('Ready!')
            break
        case 'list':
            sayItems()
            break
        case 'dig':
            dig()
            break
        case 'build':
            build()
            break
        case 'equip dirt':
            equipDirt()
            break
    }
})

function sayItems(items = bot.inventory.items()) {
    const output = items.map(itemToString).join(', ')
    if (output) {
        bot.chat(output)
    } else {
        bot.chat('empty')
    }
}

async function dig() {
    let target
    if (bot.targetDigBlock) {
        bot.chat(`already digging ${bot.targetDigBlock.name}`)
    } else {
        target = bot.blockAt(bot.entity.position.offset(0, -1, 0))
        if (target && bot.canDigBlock(target)) {
            bot.chat(`starting to dig ${target.name}`)
            try {
                await bot.dig(target)
                bot.chat(`finished digging ${target.name}`)
            } catch (err) {
                console.log(err.stack)
            }
        } else {
            bot.chat('cannot dig')
        }
    }
}

function build() {
    const referenceBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0))
    const jumpY = Math.floor(bot.entity.position.y) + 1.0
    bot.setControlState('jump', true)
    bot.on('move', placeIfHighEnough)

    let tryCount = 0

    async function placeIfHighEnough() {
        if (bot.entity.position.y > jumpY) {
            try {
                await bot.placeBlock(referenceBlock, vec3(0, 1, 0))
                bot.setControlState('jump', false)
                bot.removeListener('move', placeIfHighEnough)
                bot.chat('Placing a block was successful')
            } catch (err) {
                tryCount++
                if (tryCount > 10) {
                    bot.chat(err.message)
                    bot.setControlState('jump', false)
                    bot.removeListener('move', placeIfHighEnough)
                }
            }
        }
    }
}

async function equipDirt() {
    let itemsByName
    if (bot.supportFeature('itemsAreNotBlocks')) {
        itemsByName = 'itemsByName'
    } else if (bot.supportFeature('itemsAreAlsoBlocks')) {
        itemsByName = 'blocksByName'
    }
    try {
        await bot.equip(bot.registry[itemsByName].dirt.id, 'hand')
        bot.chat('equipped dirt')
    } catch (err) {
        bot.chat(`unable to equip dirt: ${err.message}`)
    }
}

function itemToString(item) {
    if (item) {
        return `${item.name} x ${item.count}`
    } else {
        return '(nothing)'
    }
}

// DEBUG
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))