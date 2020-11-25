import { GuildMember } from 'discord.js';
import { Houses } from '../models/Stat';
import logger from './logger';
import { Configs } from '../config/configs';

export function addPoints(points: number, house_points: Houses, member: GuildMember): Houses {

    const memberRoles = member.roles.cache;

    let pointsToAdd: Houses = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };

    if (memberRoles.has(Configs.role_gryffindor)) {
        pointsToAdd.gryffindor += points * Configs.gryffindor_points_multiplier;
    }
    if (memberRoles.has(Configs.role_slytherin)) {
        pointsToAdd.slytherin += points * Configs.slytherin_points_multiplier;
    }

    if (memberRoles.has(Configs.role_ravenclaw)) {
        pointsToAdd.ravenclaw += points * Configs.ravenclaw_points_multiplier;
    }

    if (memberRoles.has(Configs.role_hufflepuff)) {
        pointsToAdd.hufflepuff += points * Configs.hufflepuff_points_multiplier;
    }


    house_points.gryffindor += pointsToAdd.gryffindor;
    house_points.ravenclaw += pointsToAdd.ravenclaw;
    house_points.slytherin += pointsToAdd.slytherin;
    house_points.hufflepuff += pointsToAdd.hufflepuff;

    return house_points;
}