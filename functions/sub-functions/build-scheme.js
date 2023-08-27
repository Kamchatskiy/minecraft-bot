const { Schematic } = require('prismarine-schematic')
const { builder, Build } = require('mineflayer-builder')
const path = require('path')
const fs = require('fs').promises

async function buildScheme(bot, schemeName) {
    const schematic = await Schematic.read(await fs.readFile(path.resolve(__dirname, '../../schematics/', schemeName)), bot.version)
    while (!bot.entity.onGround) {
        await wait(100)
    }
    const at = bot.entity.position.floored()
    console.log('Building at ', at)
    const build = new Build(schematic, bot.world, at)
    bot.builder.build(build)
}

module.exports = {
    buildScheme
}