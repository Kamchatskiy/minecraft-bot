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

module.exports = {
    equipDirt
};