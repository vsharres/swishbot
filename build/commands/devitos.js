"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Devitos = void 0;
var configs_1 = require("../config/configs");
var command_1 = require("./command");
var Devitos = /** @class */ (function (_super) {
    __extends(Devitos, _super);
    function Devitos() {
        return _super.call(this, "convert", 'Converts the provided number to devitos', 10, '<amount> <type>', true) || this;
    }
    Devitos.prototype.execute = function (message, args, logger) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed, multiplier, unit, rex, match, feet, inches, devitos_1, devitos_string_1, amount, devitos, devitos_string, parsed, multiplier, amount, unit, devitos, string_devitos, firstAmount, secondAmount, firstmultiplier, secondMultiplier, firstunit, secondunit, parsed, amount, devitos;
            return __generator(this, function (_a) {
                //for the usage of having only on number on the args
                if (args.length === 1) {
                    parsed = args.shift();
                    multiplier = 1;
                    //Need to replace the regex so that . can be parsed out
                    if (!parsed) {
                        logger.log('error', "Error parsing the message.");
                        return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")
                                .catch(function (err) { return logger.log('error', err); })];
                    }
                    unit = parsed.replace(/[0-9]/g, '');
                    rex = /^(?!$|.*\'[^\x22]+$)(?:([0-9]+)\')?(?:([0-9]+)\x22?)?$/;
                    match = rex.exec(parsed);
                    if (match) {
                        feet = parseFloat(match[1]) ? parseFloat(match[1]) : 0;
                        inches = parseFloat(match[2]) ? parseFloat(match[2]) : 0;
                        devitos_1 = (((feet * 30.48) + (inches * 2.54)) / configs_1.Configs.height);
                        devitos_string_1 = new Intl.NumberFormat('en-IN').format(devitos_1);
                        return [2 /*return*/, message.channel.send(message.author.toString() + " " + (feet > 0 ? feet + "'" : '') + (inches > 0 ? inches + '"' : '') + " is " + devitos_string_1 + " " + configs_1.Configs.command_prefix + "!")
                                .catch(function (err) { return logger.log('error', err); })];
                    }
                    switch (unit) {
                        case 'm':
                            multiplier = 100;
                            break;
                        case 'meters':
                            multiplier = 100;
                            break;
                        case 'meter':
                            multiplier = 100;
                            break;
                        case 'cm':
                            multiplier = 1;
                            break;
                        case 'centimeters':
                            multiplier = 1;
                            break;
                        case 'centimeter':
                            multiplier = 1;
                            break;
                        case 'km':
                            multiplier = 100000;
                            break;
                        case 'kilometers':
                            multiplier = 100000;
                            break;
                        case 'kilometer':
                            multiplier = 100000;
                            break;
                        case 'yd':
                            multiplier = 91.44;
                            break;
                        case 'yard':
                            multiplier = 91.44;
                            break;
                        case 'yards':
                            multiplier = 91.44;
                            break;
                        case 'mi':
                            multiplier = 160934;
                            break;
                        case 'mile':
                            multiplier = 160934;
                            break;
                        case 'miles':
                            multiplier = 160934;
                            break;
                        default:
                            return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")
                                    .catch(function (err) { return logger.log('error', err); })];
                    }
                    parsed = parsed.substring(0, parsed.length - unit.length);
                    amount = parseFloat(parsed);
                    devitos = (amount * multiplier / configs_1.Configs.height);
                    devitos_string = new Intl.NumberFormat('en-IN').format(devitos);
                    return [2 /*return*/, message.channel.send(message.author.toString() + " " + amount + " " + unit + " is " + devitos_string + " " + configs_1.Configs.command_prefix + "!")
                            .catch(function (err) { return logger.log('error', err); })];
                }
                //for more than one arg in the command, as if the unit is separate from the number
                else if (args.length == 2 && !isNaN(parseFloat(args[0]))) {
                    parsed = args.shift();
                    multiplier = 1;
                    if (!parsed) {
                        logger.log('error', "Error parsing the message.");
                        return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")
                                .catch(function (err) { return logger.log('error', err); })];
                    }
                    amount = parseFloat(parsed);
                    unit = args.shift();
                    switch (unit) {
                        case 'cm':
                            multiplier = 1;
                            break;
                        case 'centimeters':
                            multiplier = 1;
                            break;
                        case 'centimeter':
                            multiplier = 1;
                            break;
                        case 'm':
                            multiplier = 100;
                            break;
                        case 'meter':
                            multiplier = 100;
                            break;
                        case 'meters':
                            multiplier = 100;
                            break;
                        case 'km':
                            multiplier = 100000;
                            break;
                        case 'kilometer':
                            multiplier = 100000;
                            break;
                        case 'kilometers':
                            multiplier = 100000;
                            break;
                        case 'mi':
                            multiplier = 160934;
                            break;
                        case 'mile':
                            multiplier = 160934;
                            break;
                        case 'miles':
                            multiplier = 160934;
                            break;
                        case 'yd':
                            multiplier = 91.44;
                            break;
                        case 'yard':
                            multiplier = 91.44;
                            break;
                        case 'yards':
                            multiplier = 91.44;
                            break;
                        case 'inches':
                            multiplier = 2.54;
                            break;
                        case 'inch':
                            multiplier = 2.54;
                            break;
                        case 'feet':
                            multiplier = 30.48;
                            break;
                        case 'foot':
                            multiplier = 30.48;
                            break;
                        default:
                            return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")
                                    .catch(function (err) { return logger.log('error', err); })];
                    }
                    devitos = (amount * multiplier / configs_1.Configs.height);
                    string_devitos = new Intl.NumberFormat('en-IN').format(devitos);
                    return [2 /*return*/, message.channel.send(message.author.toString() + " " + amount + " " + unit + " is " + string_devitos + " " + configs_1.Configs.command_prefix + "!")];
                }
                else if (args.length === 3) {
                    firstAmount = 0;
                    secondAmount = 0;
                    firstmultiplier = 1;
                    secondMultiplier = 1;
                    firstunit = 'feet';
                    secondunit = 'inches';
                    parsed = args.shift();
                    if (!parsed) {
                        logger.log('error', "Error parsing the message.");
                        return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")];
                    }
                    firstAmount = parseFloat(parsed);
                    parsed = args.shift();
                    if (!parsed) {
                        logger.log('error', "Error parsing the message.");
                        return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")];
                    }
                    firstunit = parsed;
                    parsed = args.shift();
                    if (!parsed) {
                        logger.log('error', "Error parsing the message.");
                        return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")];
                    }
                    secondAmount = parseFloat(parsed);
                    parsed = args.shift();
                    if (!parsed) {
                        logger.log('error', "Error parsing the message.");
                        return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")];
                    }
                    secondunit = parsed;
                    if (firstunit === 'feet' && secondunit === 'inches') {
                        firstmultiplier = 30.48;
                        secondMultiplier = 2.54;
                    }
                    else {
                        return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")];
                    }
                    amount = (firstAmount * firstmultiplier + secondAmount & secondMultiplier) / configs_1.Configs.height;
                    devitos = new Intl.NumberFormat('en-IN').format(amount);
                    return [2 /*return*/, message.channel.send(message.author.toString() + " " + firstAmount + " " + firstunit + " " + secondMultiplier + " " + secondunit + " is " + devitos + " " + configs_1.Configs.command_prefix + "!")];
                }
                else {
                    return [2 /*return*/, message.channel.send(message.author.toString() + " the proper usage would be: " + configs_1.Configs.command_prefix + " `" + this.name + " " + this.usage + "`")];
                }
                return [2 /*return*/];
            });
        });
    };
    return Devitos;
}(command_1.Command));
exports.Devitos = Devitos;
;
exports.default = new Devitos();
