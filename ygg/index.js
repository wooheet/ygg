var Ygg = require('./lib/ygg');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Ygg === 'undefined') {
    window.Ygg = Ygg;
}

module.exports = Ygg;
