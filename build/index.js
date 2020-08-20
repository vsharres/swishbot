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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
var mongoose_1 = __importDefault(require("mongoose"));
var configs_1 = require("./config/configs");
var winston_1 = __importDefault(require("winston"));
var print_points_1 = require("./tools/print_points");
var Stat_1 = __importDefault(require("./models/Stat"));
var countdown_1 = __importDefault(require("./commands/countdown"));
var devitos_1 = __importDefault(require("./commands/devitos"));
var dumbledore_1 = __importDefault(require("./commands/dumbledore"));
var flu_1 = __importDefault(require("./commands/flu"));
var lightning_1 = __importDefault(require("./commands/lightning"));
var points_1 = __importDefault(require("./commands/points"));
var points_reset_1 = __importDefault(require("./commands/points_reset"));
var recording_1 = __importDefault(require("./commands/recording"));
var logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'log' }),
    ],
    format: winston_1.default.format.printf(function (log) { return "[" + log.level.toUpperCase() + "] - " + log.message; }),
});
mongoose_1.default
    .connect(configs_1.Configs.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(function () { return logger.log('info', 'MongoDB Connected'); })
    .catch(function (err) { return logger.log('error', err); });
//import("./commands/devitos").then(command => logger.log('info', "devitos"));
var client = new discord_js_1.default.Client({ partials: ['REACTION', 'MESSAGE'] });
var commands = new discord_js_1.default.Collection();
var cooldowns = new discord_js_1.default.Collection();
//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts') && !file.endsWith('command.ts'));
commands.set(countdown_1.default.name, countdown_1.default);
commands.set(devitos_1.default.name, devitos_1.default);
commands.set(dumbledore_1.default.name, dumbledore_1.default);
commands.set(flu_1.default.name, flu_1.default);
commands.set(lightning_1.default.name, lightning_1.default);
commands.set(points_1.default.name, points_1.default);
commands.set(points_reset_1.default.name, points_reset_1.default);
commands.set(recording_1.default.name, recording_1.default);
client.once('ready', function () {
    logger.log('info', 'Ready!');
});
//Checking for reactions
client.on('messageReactionAdd', function (reaction, user) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1, error_2, guild, guildMember, adminRole, headRole, pointsToAdd, emoji, member;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!reaction.partial) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, reaction.fetch()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                logger.log('error', "Something went wrong when fetching the message: " + error_1);
                return [2 /*return*/];
            case 4:
                if (!user.partial) return [3 /*break*/, 8];
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, user.fetch()];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                error_2 = _a.sent();
                logger.log('error', "Something went wrong when fetching the user: " + error_2);
                return [2 /*return*/];
            case 8:
                guild = reaction.message.guild;
                if (!guild) {
                    logger.log('error', "error getting the guild of the reaction");
                    return [2 /*return*/];
                }
                guildMember = guild.members.cache.get(user.id);
                if (!guildMember || reaction.message.author.id === user.id) {
                    logger.log('error', "error getting the guildmemers or the member reacter on his own message");
                    return [2 /*return*/];
                }
                adminRole = guildMember.roles.cache.has(configs_1.Configs.admin_role_id);
                headRole = guildMember.roles.cache.has(configs_1.Configs.head_pupil_id);
                if (adminRole === false && headRole === false) {
                    return [2 /*return*/];
                }
                pointsToAdd = {
                    gryffindor: 0,
                    slytherin: 0,
                    ravenclaw: 0,
                    hufflepuff: 0
                };
                emoji = reaction.emoji.toString();
                member = reaction.message.member;
                if (!member) {
                    return [2 /*return*/];
                }
                member.roles.cache.find(function (role) {
                    if (role.id === configs_1.Configs.gryffindor_role) {
                        if (emoji === configs_1.Configs.emoji_addpoints) {
                            pointsToAdd.gryffindor += 10;
                        }
                        else if (emoji === configs_1.Configs.emoji_removepoints) {
                            pointsToAdd.gryffindor -= 10;
                        }
                        return true;
                    }
                    else if (role.id === configs_1.Configs.slytherin_role) {
                        if (emoji === configs_1.Configs.emoji_addpoints) {
                            pointsToAdd.slytherin += 10;
                        }
                        else if (emoji === configs_1.Configs.emoji_removepoints) {
                            pointsToAdd.slytherin -= 10;
                        }
                        return true;
                    }
                    else if (role.id === configs_1.Configs.ravenclaw_role) {
                        if (emoji === configs_1.Configs.emoji_addpoints) {
                            pointsToAdd.ravenclaw += 10;
                        }
                        else if (emoji === configs_1.Configs.emoji_removepoints) {
                            pointsToAdd.ravenclaw -= 10;
                        }
                        return true;
                    }
                    else if (role.id === configs_1.Configs.hufflepuff_role) {
                        if (emoji === configs_1.Configs.emoji_addpoints) {
                            pointsToAdd.hufflepuff += 10;
                        }
                        else if (emoji === configs_1.Configs.emoji_removepoints) {
                            pointsToAdd.hufflepuff -= 10;
                        }
                        return true;
                    }
                    return false;
                });
                //Return if there is no points to add, this is a sanity check, in the usual mode, this wouldn't be a problem
                if (pointsToAdd.gryffindor === 0 && pointsToAdd.slytherin === 0 && pointsToAdd.ravenclaw === 0 && pointsToAdd.hufflepuff === 0)
                    return [2 /*return*/];
                Stat_1.default.findById(configs_1.Configs.stats_id).then(function (stat) {
                    if (!stat) {
                        return;
                    }
                    var points = stat.points[stat.points.length - 1];
                    points.gryffindor += pointsToAdd.gryffindor;
                    if (points.gryffindor <= 0)
                        points.gryffindor = 0;
                    points.ravenclaw += pointsToAdd.ravenclaw;
                    if (points.ravenclaw <= 0)
                        points.ravenclaw = 0;
                    points.slytherin += pointsToAdd.slytherin;
                    if (points.slytherin <= 0)
                        points.slytherin = 0;
                    points.hufflepuff += pointsToAdd.hufflepuff;
                    if (points.hufflepuff <= 0)
                        points.hufflepuff = 0;
                    stat
                        .save()
                        .then(function () {
                        logger.log('info', 'Points saved!');
                    })
                        .catch(function (err) { return logger.log('error', err); });
                    print_points_1.printPoints(reaction.message, points, logger);
                });
                return [2 /*return*/];
        }
    });
}); });
//Listening to lightningbolts
client.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!message.content.startsWith('⚡'))
            return [2 /*return*/];
        Stat_1.default.findById(configs_1.Configs.stats_id).then(function (stat) {
            if (!stat) {
                return;
            }
            var question = {
                member: message.author.id,
                question: message.content,
            };
            stat.lightnings.push(question);
            stat
                .save()
                .then(function () {
                logger.log('info', "lightning bolt question saved!");
                message.reply("Your lightning bolt question was saved!");
            })
                .catch(function (err) { return logger.log('error', err); });
        }).catch(function (err) { return logger.log('error', err); });
        return [2 /*return*/];
    });
}); });
//General commands given to the bot
client.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var args, commandName, member, isDMChannel, command, isAdminRole, isITRole, headRole, now, timestamps, reply_1, reply_2, attachments, attachment, cooldownAmount, author_timestamp, expirationTime, timeLeft_1;
    return __generator(this, function (_a) {
        //Ignores all messages and commands send to the bot from DM
        if (!message.guild)
            return [2 /*return*/];
        if (!message.content.startsWith(configs_1.Configs.command_prefix) || message.author.bot)
            return [2 /*return*/];
        args = message.content.slice(configs_1.Configs.command_prefix.length).split(/ +/);
        args.shift();
        commandName = args.shift();
        if (!commandName)
            return [2 /*return*/];
        commandName = commandName.toLowerCase();
        if (!commands.has(commandName)) {
            logger.log('warn', "Couldn't find the command " + commandName);
            return [2 /*return*/];
        }
        member = message.member;
        if (!member) {
            return [2 /*return*/];
        }
        isDMChannel = message.channel.type === 'dm';
        command = commands.get(commandName);
        if (!command) {
            return [2 /*return*/];
        }
        isAdminRole = member.roles.cache.has(configs_1.Configs.admin_role_id);
        isITRole = member.roles.cache.has(configs_1.Configs.hogwarts_IT_id);
        if (command.admin && (isAdminRole === false && isITRole === false)) {
            logger.log('warn', message.author.toString() + " does not have the necessary role to execute this command. The necessary role is " + configs_1.Configs.admin_role_id);
            return [2 /*return*/];
        }
        headRole = member.roles.cache.has(configs_1.Configs.head_pupil_id);
        if (command.head_pupil && (headRole === false && isAdminRole === false && isITRole === false)) {
            logger.log('warn', message.author.toString() + " does not have the necessary role to execute this command. The necessary role is " + configs_1.Configs.head_pupil_id);
            return [2 /*return*/];
        }
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new discord_js_1.default.Collection());
        }
        now = Date.now();
        timestamps = cooldowns.get(command.name);
        if (!timestamps) {
            logger.log('error', "Error at getting the time stamps");
            return [2 /*return*/];
        }
        if ((command.args && !args.length) || (command.attachments && message.attachments.size === 0)) {
            reply_1 = "You didn't provide any arguments, " + message.author.toString() + "!";
            if (command.usage) {
                reply_1 += "\nThe proper usage would be: `" + configs_1.Configs.command_prefix + command.name + " " + command.usage + "`";
            }
            return [2 /*return*/, member.createDM()
                    .then(function (channel) {
                    channel.send(reply_1)
                        .catch(function (err) { return console.error(err); });
                })
                    .catch(function (err) { return console.error(err); })];
        }
        if (command.attachments && message.attachments.size === 0) {
            reply_2 = "You didn't provide any attachment, " + message.author.toString() + "!";
            if (command.usage) {
                reply_2 += "\nThe proper usage would be: `" + configs_1.Configs.command_prefix + command.name + " " + command.usage + "`";
            }
            return [2 /*return*/, member.createDM()
                    .then(function (channel) {
                    channel.send(reply_2)
                        .catch(function (err) { return console.error(err); });
                })
                    .catch(function (err) { return console.error(err); })];
        }
        else if (command.attachments && message.attachments.size > 0) {
            attachments = message.attachments;
            if (!attachments) {
                return [2 /*return*/];
            }
            attachment = attachments.first();
            if (!attachment) {
                return [2 /*return*/];
            }
            /**
            if (attachment.width ? attachment.width : 0 > command.attachment_size ||
                attachment.height ? attachment.height : 0 > command.attachment_size) {
                return member.createDM()
                    .then(channel => {
                        channel.send(`${message.author.toString()} the attached image must be smaller than ${command.attachment_size}x${command.attachment_size}!`)
                            .catch(err => console.error(err));
                    })
                    .catch(err => console.error(err));
            }
            */
        }
        cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id)) {
            author_timestamp = timestamps.get(message.author.id);
            if (!author_timestamp) {
                return [2 /*return*/];
            }
            expirationTime = author_timestamp + cooldownAmount;
            if (now < expirationTime && !isAdminRole) {
                timeLeft_1 = (expirationTime - now) / 1000;
                logger.log('info', timeLeft_1);
                return [2 /*return*/, member.createDM()
                        .then(function (channel) {
                        channel.send("Hello " + message.author.toString() + " please wait " + timeLeft_1.toFixed(1) + " more second(s) before reusing the `" + command.name + "` command.")
                            .catch(function (err) { return console.error(err); });
                    })
                        .catch(function (err) { return console.error(err); })];
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(function () { return timestamps.delete(message.author.id); }, cooldownAmount);
        try {
            command.execute(message, args, logger);
        }
        catch (error) {
            console.error(error);
            member.createDM()
                .then(function (channel) {
                channel.send('there was an error trying to execute that command!')
                    .catch(function (err) { return console.error(err); });
            })
                .catch(function (err) { return console.error(err); });
        }
        logger.log('info', message.content);
        return [2 /*return*/];
    });
}); });
process.on('uncaughtException', function (error) { return logger.log('error', error); });
process.on('unhandledRejection', function (error) {
    logger.log('error', error);
});
client.login(configs_1.Configs.token);
