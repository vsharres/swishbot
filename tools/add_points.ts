import { GuildMember } from 'discord.js';
import { Houses } from '../models/Stat';
import { Configs } from '../config/configs';

/**
 * Function responsible for giving points to members of every house a user has a role.
 * @param points This param is number of points to be added to the house.
 * @param house_points The current totals of house points
 * @param member The member of the discord server to give out points to
 * @returns The total number of points
 */
export function AddPointsToMember(points: number, house_points: Houses, member: GuildMember): Houses {

    const memberRoles = member.roles.cache;

    if (memberRoles.has(Configs.role_slytherin)) {
        house_points.slytherin += points * Configs.slytherin_points_multiplier;
    }

    if (memberRoles.has(Configs.role_gryffindor)) {
        house_points.gryffindor += points * Configs.gryffindor_points_multiplier;
    }

    if (memberRoles.has(Configs.role_ravenclaw)) {
        house_points.ravenclaw += points * Configs.ravenclaw_points_multiplier;
    }

    if (memberRoles.has(Configs.role_hufflepuff)) {
        house_points.hufflepuff += points * Configs.hufflepuff_points_multiplier;
    }

    return house_points;
}

/**
 * Function responsible for giving points to a specific house
 * @param points This param is number of points to be added to the house.
 * @param house_points The current totals of house points
 * @param house The house role id
 * @returns The total number of points
 */
export function addPointsToHouse(points: number, house_points: Houses, house: string): Houses {

    switch (house) {
        case Configs.role_gryffindor:
            house_points.gryffindor += points * Configs.gryffindor_points_multiplier;
            break;
        case Configs.role_hufflepuff:
            house_points.hufflepuff += points * Configs.hufflepuff_points_multiplier;
            break;
        case Configs.role_ravenclaw:
            house_points.ravenclaw += points * Configs.ravenclaw_points_multiplier;
            break;
        case Configs.role_slytherin:
            house_points.slytherin += points * Configs.slytherin_points_multiplier;
        default:
            break;
    }

    return house_points;

}