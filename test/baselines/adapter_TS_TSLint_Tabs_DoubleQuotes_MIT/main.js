const isCompactMode = module && module.parent;
module.exports = require("./build/main.js")(isCompactMode);