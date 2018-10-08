/*
    This file is part of ygg.js.
*/
/**
 * @file ygg.js
 * @authors:
 *   Tedy Woo <tedy@r2v.io>
 * @date 2018
 */

var RequestManager = require('./ygg/requestmanager');
var Iban = require('./ygg/iban');
var Eth = require('./ygg/methods/eth');
var DB = require('./ygg/methods/db');
var Shh = require('./ygg/methods/shh');
var Net = require('./ygg/methods/net');
var Personal = require('./ygg/methods/personal');
var Swarm = require('./ygg/methods/swarm');
var Settings = require('./ygg/settings');
var version = require('./version.json');
var utils = require('./utils/utils');
var sha3 = require('./utils/sha3');
var extend = require('./ygg/extend');
var Batch = require('./ygg/batch');
var Property = require('./ygg/property');
var HttpProvider = require('./ygg/httpprovider');
var IpcProvider = require('./ygg/ipcprovider');
var BigNumber = require('bignumber.js');



function Ygg (provider) {
    this._requestManager = new RequestManager(provider);
    this.currentProvider = provider;
    this.eth = new Eth(this);
    this.db = new DB(this);
    this.shh = new Shh(this);
    this.net = new Net(this);
    this.personal = new Personal(this);
    this.bzz = new Swarm(this);
    this.settings = new Settings();
    this.version = {
        api: version.version
    };
    this.providers = {
        HttpProvider: HttpProvider,
        IpcProvider: IpcProvider
    };
    this._extend = extend(this);
    this._extend({
        properties: properties()
    });
}

// expose providers on the class
Ygg.providers = {
    HttpProvider: HttpProvider,
    IpcProvider: IpcProvider
};

Ygg.prototype.setProvider = function (provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
};

Ygg.prototype.reset = function (keepIsSyncing) {
    this._requestManager.reset(keepIsSyncing);
    this.settings = new Settings();
};

Ygg.prototype.BigNumber = BigNumber;
Ygg.prototype.utils = utils;


Ygg.prototype.sha3 = function(string, options) {
    return '0x' + sha3(string, options);
};

/**
 * Transforms direct icap to address
 */
Ygg.prototype.fromICAP = function (icap) {
    var iban = new Iban(icap);
    return iban.address();
};

var properties = function () {
    return [
        new Property({
            name: 'version.node',
            getter: 'web3_clientVersion'
        }),
        new Property({
            name: 'version.network',
            getter: 'net_version',
            inputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'version.ethereum',
            getter: 'eth_protocolVersion',
            inputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'version.whisper',
            getter: 'shh_version',
            inputFormatter: utils.toDecimal
        })
    ];
};

Ygg.prototype.isConnected = function(){
    return (this.currentProvider && this.currentProvider.isConnected());
};

Ygg.prototype.createBatch = function () {
    return new Batch(this);
};

module.exports = Ygg;

