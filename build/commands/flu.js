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
exports.Flu = void 0;
var configs_1 = require("../config/configs");
var command_1 = require("./command");
var Flu = /** @class */ (function (_super) {
    __extends(Flu, _super);
    function Flu() {
        return _super.call(this, "flu", 'Sends a message to all discord members', 1, '<Roles to Exclude>') || this;
    }
    Flu.prototype.execute = function (message, args, logger) {
        return __awaiter(this, void 0, void 0, function () {
            var guild;
            return __generator(this, function (_a) {
                if (message.author.id !== configs_1.Configs.vini_id && message.author.id !== configs_1.Configs.marchismo_id && message.author.id !== configs_1.Configs.mia_id && message.author.id !== configs_1.Configs.brandon_id)
                    return [2 /*return*/];
                args.push('Bot');
                args.push('Founders');
                args.push('Hogwarts Ghosts');
                guild = message.guild;
                if (!guild) {
                    return [2 /*return*/, logger.log('error', 'Error getting the guild, check the id')];
                }
                guild.members.fetch()
                    .then(function (members) {
                    members.forEach(function (member) {
                        var roles = member.roles.cache.find(function (role) { return args.includes(role.name); });
                        if (!roles) {
                            member.createDM()
                                .then(function (channel) {
                                channel.send("Hello Swisher!\n\nJust a reminder, we are planning a surprise thank you gift to the hosts of Swish and Flick on their anniversary. We thought it would be fun to all leave messages on what they mean to us!\n\nWe have had some hiccups with the google form we are using to collect answers. If you run into an issue where the form isn't working OR you need to edit or resubmit your response please privately direct message: " + members.get(configs_1.Configs.mia_id) + " " + members.get(configs_1.Configs.marchismo_id) + " " + members.get(configs_1.Configs.brandon_id) + " or " + members.get(configs_1.Configs.vini_id) + ".\n\nIf you want to participate, click the link below. Don't forget this is supposed to be a **SURPRISE**, __please don't discuss in the general discord chat__. The deadline for submitting a message is **July 15th!**\n\nhttps://forms.gle/2EZRaUJQsymPHgEZ8")
                                    .catch(function (err) { return logger.log('error', err); });
                            })
                                .catch(function (err) { return logger.log('error', err); });
                        }
                    });
                })
                    .catch(function (err) { return logger.log('error', err); });
                return [2 /*return*/];
            });
        });
    };
    return Flu;
}(command_1.Command));
exports.Flu = Flu;
;
exports.default = new Flu();
