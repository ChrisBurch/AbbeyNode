function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

exports.randomItem = randomItem;