import { GuildMember } from 'discord.js';
import { Houses } from '../models/Stat';
import { Configs } from '../config/configs';

/**
 * Function responsible for giving points to members of a specific house.
 * @param points - This param is number of points to be added to the house.
 * @param house_points - The current totals of house points
 * @param member - The member of the discord server to give out points to
 */
export function addPoints(points: number, house_points: Houses, member: GuildMember): Houses {

    const memberRoles = member.roles.cache;

    let pointsToAdd: Houses = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };

    memberRoles.forEach(role => {
        if (Configs.role_gryffindor === role.id) {
            pointsToAdd.gryffindor += points * Configs.gryffindor_points_multiplier;
        }

        if (Configs.role_slytherin === role.id) {
            pointsToAdd.slytherin += points * Configs.slytherin_points_multiplier;
        }

        if (Configs.role_ravenclaw === role.id) {
            pointsToAdd.ravenclaw += points * Configs.ravenclaw_points_multiplier;
        }

        if (Configs.role_hufflepuff === role.id) {
            pointsToAdd.hufflepuff += points * Configs.hufflepuff_points_multiplier;
        }
    });

    house_points.gryffindor += pointsToAdd.gryffindor;
    house_points.ravenclaw += pointsToAdd.ravenclaw;
    house_points.slytherin += pointsToAdd.slytherin;
    house_points.hufflepuff += pointsToAdd.hufflepuff;
    return house_points;
}