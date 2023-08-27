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

module.exports = {
    dig
}