"use strict";
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
exports.printPoints = void 0;
var configs_1 = require("../config/configs");
function printPoints(message, points, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var hourglass_channel, houses, gryf, slyth, raven, huff, reply, index, placement;
        return __generator(this, function (_a) {
            //Delete the previous message
            if (configs_1.Configs.house_points_channel !== undefined && message.guild) {
                hourglass_channel = message.guild.channels.cache.get(configs_1.Configs.house_points_channel);
                if (hourglass_channel) {
                    hourglass_channel.bulkDelete(4)
                        .then(function (messages) {
                        return logger.log('info', "Bulk deleted " + messages.size + " messages");
                    })
                        .catch(function (error) { return logger.log('error', error); });
                }
                else {
                    return [2 /*return*/, logger.log('error', 'Couldn\'t find the hourglass channel, check Id')];
                }
                houses = [{
                        house: 'Gryffindor 🦁',
                        points: points.gryffindor
                    },
                    {
                        house: 'Slytherin 🐍',
                        points: points.slytherin
                    },
                    {
                        house: 'Ravenclaw 🦅',
                        points: points.ravenclaw
                    },
                    {
                        house: 'Hufflepuff 🦡',
                        points: points.hufflepuff
                    }
                ];
                gryf = houses[0].points;
                slyth = houses[1].points;
                raven = houses[2].points;
                huff = houses[3].points;
                houses.sort(function (a, b) { return b.points - a.points; });
                reply = '**House Points**\n\n';
                //Check if any house is tied
                if (gryf === slyth || gryf === raven || gryf === huff || slyth === raven || slyth === huff || raven === huff) {
                    //for the case when all houses are tied
                    if (gryf === slyth && slyth === raven && raven === huff) {
                        reply += "All houses are tied with **" + gryf + " points!**";
                        return [2 /*return*/, hourglass_channel.send(reply)
                                .catch(function (error) { return logger.log('error', error); })];
                    }
                    //for the case with 3 houses tied
                    else if ((gryf === slyth && slyth === raven) || (gryf === slyth && slyth === huff) || (gryf === raven && raven === huff) || (slyth === raven && raven === huff)) {
                        if (houses[0] === houses[1]) {
                            reply += houses[0].house + ", " + houses[1].house + ", " + houses[2].house + " are tied in first place with **" + houses[0].points + " points!**\n\n";
                            reply += houses[3].house + " is in second place with **" + houses[3].points + " points!**\n";
                        }
                        else {
                            reply += houses[0].house + " is in first place with **" + houses[0].points + " points!**\n";
                            reply += houses[1].house + ", " + houses[2].house + ", " + houses[3].house + " are tied in second place with **" + houses[1].points + " points!**\n\n";
                        }
                        return [2 /*return*/, hourglass_channel.send(reply)
                                .catch(function (error) { return logger.log('error', error); })];
                    }
                    //for the case where only two houses are tied
                    else {
                        if (houses[0] === houses[1] && houses[2] === houses[3]) {
                            reply += houses[0].house + ", " + houses[1].house + " are tied in first place with **" + houses[0].points + " points!**\n";
                            reply += houses[2].house + ", " + houses[3].house + " are tied in second place with **" + houses[2].points + " points!**\n";
                            return [2 /*return*/, hourglass_channel.send(reply)
                                    .catch(function (error) { return logger.log('error', error); })];
                        }
                        else if (houses[0] === houses[1]) {
                            reply += houses[0].house + ", " + houses[1].house + " are tied in first place with **" + houses[0].points + " points!**\n";
                            reply += houses[2].house + " is in second place with **" + houses[2].points + " points!**\n";
                            reply += houses[3].house + " is in third place with **" + houses[3].points + " points!**\n\n";
                            return [2 /*return*/, hourglass_channel.send(reply)
                                    .catch(function (error) { return logger.log('error', error); })];
                        }
                        else if (houses[1] === houses[2]) {
                            reply += houses[0].house + " is in first place with **" + houses[0].points + " points!**\n";
                            reply += houses[1].house + ", " + houses[2].house + " are tied in second place with **" + houses[1].points + " points!**\n";
                            reply += houses[3].house + " is in third place with **" + houses[3].points + " points!**\n\n";
                            return [2 /*return*/, hourglass_channel.send(reply)
                                    .catch(function (error) { return logger.log('error', error); })];
                        }
                        else {
                            reply += houses[0].house + " is in first place with **" + houses[0].points + " points!**\n";
                            reply += houses[1].house + " is in second place with **" + houses[1].points + " points!**\n";
                            reply += houses[2].house + ", " + houses[3].house + " are tied in third place with **" + houses[2].points + " points!**\n\n";
                            return [2 /*return*/, hourglass_channel.send(reply)
                                    .catch(function (error) { return logger.log('error', error); })];
                        }
                    }
                }
                else {
                    for (index = 0; index < houses.length; index++) {
                        placement = '';
                        switch (index) {
                            case 0:
                                placement = 'first';
                                break;
                            case 1:
                                placement = 'second';
                                break;
                            case 2:
                                placement = 'third';
                                break;
                            case 3:
                                placement = 'fourth';
                                break;
                            default:
                                break;
                        }
                        reply += houses[index].house + " is in " + placement + " place with **" + houses[index].points + " points!**\n";
                    }
                    reply += '\n';
                    return [2 /*return*/, hourglass_channel.send(reply)
                            .catch(function (error) { return logger.log('error', error); })];
                }
            }
            return [2 /*return*/];
        });
    });
}
exports.printPoints = printPoints;
