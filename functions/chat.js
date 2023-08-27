const dig = require('./sub-functions/dig.js')
const build = require('./sub-functions/build.js')
const equipDirt = require('./sub-functions/equipDirt.js')
const itemToString = require('./sub-functions/itemToString.js')

const { buildScheme } = require('./sub-functions/build-scheme.js')

// Chat commands
function registerChatCommands(bot) {
    bot.on('chat', async (username, message) => {
        if (username === bot.username) return
        switch (message) {
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
            const output = items.map(itemToString).join(', ')
            if (output) {
                bot.chat(output)
            } else {
                bot.chat('empty')
            }
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

        case 'build scheme':
            bot.on('chat', async (username, message) => {
                buildScheme(bot, message)
            })
        }
    })
}

module.exports = {
    registerChatCommands
}