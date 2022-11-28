import { Configs } from '../config/configs';

interface Unit {
    name: string,
    multiplier: number,
    divisor: number
}

const UnitsArray: Unit[] = [
    {
        name: 'm',
        multiplier: 100,
        divisor: Configs.devito_height
    },
    {
        name: 'meters',
        multiplier: 100,
        divisor: Configs.devito_height
    },
    {
        name: 'meter',
        multiplier: 100,
        divisor: Configs.devito_height
    },
    {
        name: 'metre',
        multiplier: 100,
        divisor: Configs.devito_height
    },
    {
        name: 'metres',
        multiplier: 100,
        divisor: Configs.devito_height
    },
    {
        name: 'cm',
        multiplier: 1,
        divisor: Configs.devito_height
    },
    {
        name: 'centimeters',
        multiplier: 1,
        divisor: Configs.devito_height
    },
    {
        name: 'mm',
        multiplier: 0.1,
        divisor: Configs.devito_height
    },
    {
        name: 'milimeter',
        multiplier: 0.1,
        divisor: Configs.devito_height
    },
    {
        name: 'milimetre',
        multiplier: 0.1,
        divisor: Configs.devito_height
    },
    {
        name: 'centimetres',
        multiplier: 0.1,
        divisor: Configs.devito_height
    },
    {
        name: 'centimeter',
        multiplier: 1,
        divisor: Configs.devito_height
    },
    {
        name: 'centimetre',
        multiplier: 1,
        divisor: Configs.devito_height
    },
    {
        name: 'feet',
        multiplier: 30.48,
        divisor: Configs.devito_height
    },
    {
        name: 'ft',
        multiplier: 30.48,
        divisor: Configs.devito_height
    },
    {
        name: 'foot',
        multiplier: 30.48,
        divisor: Configs.devito_height
    },
    {
        name: 'inch',
        multiplier: 2.54,
        divisor: Configs.devito_height
    },
    {
        name: 'inches',
        multiplier: 2.54,
        divisor: Configs.devito_height
    },
    {
        name: 'in',
        multiplier: 2.54,
        divisor: Configs.devito_height
    },
    {
        name: 'km',
        multiplier: 100000,
        divisor: Configs.devito_height
    },
    {
        name: 'kilometers',
        multiplier: 100000,
        divisor: Configs.devito_height
    },
    {
        name: 'kilometer',
        multiplier: 100000,
        divisor: Configs.devito_height
    },
    {
        name: 'kilometres',
        multiplier: 100000,
        divisor: Configs.devito_height
    },
    {
        name: 'kilometre',
        multiplier: 100000,
        divisor: Configs.devito_height
    },
    {
        name: 'yd',
        multiplier: 91.44,
        divisor: Configs.devito_height
    },
    {
        name: 'yard',
        multiplier: 91.44,
        divisor: Configs.devito_height
    },
    {
        name: 'yards',
        multiplier: 91.44,
        divisor: Configs.devito_height
    },
    {
        name: 'mi',
        multiplier: 160934,
        divisor: Configs.devito_height
    },
    {
        name: 'mile',
        multiplier: 160934,
        divisor: Configs.devito_height
    },
    {
        name: 'miles',
        multiplier: 160934,
        divisor: Configs.devito_height
    },
    {
        name: 'ly',
        multiplier: 1.057e18,
        divisor: Configs.devito_height
    },
    {
        name: 'light-year',
        multiplier: 1.057e18,
        divisor: Configs.devito_height
    },
    {
        name: 'light-years',
        multiplier: 1.057e18,
        divisor: Configs.devito_height
    },
    {
        name: 'pc',
        multiplier: 3.24078e19,
        divisor: Configs.devito_height
    },
    {
        name: 'parsec',
        multiplier: 3.24078e19,
        divisor: Configs.devito_height
    },
    {
        name: 'parsecs',
        multiplier: 3.24078e19,
        divisor: Configs.devito_height
    },
    {
        name: 'g',
        multiplier: 1,
        divisor: Configs.devito_weight
    },
    {
        name: 'gram',
        multiplier: 1,
        divisor: Configs.devito_weight
    },
    {
        name: 'grams',
        multiplier: 1,
        divisor: Configs.devito_weight
    },
    {
        name: 'kg',
        multiplier: 1000,
        divisor: Configs.devito_weight
    },
    {
        name: 'kilogram',
        multiplier: 1000,
        divisor: Configs.devito_weight
    },
    {
        name: 'kilograms',
        multiplier: 1000,
        divisor: Configs.devito_weight
    },
    {
        name: 't',
        multiplier: 1000000,
        divisor: Configs.devito_weight
    },
    {
        name: 'tonne',
        multiplier: 1000000,
        divisor: Configs.devito_weight
    },
    {
        name: 'tonnes',
        multiplier: 1000000,
        divisor: Configs.devito_weight
    },
    {
        name: 'lb',
        multiplier: 453.59,
        divisor: Configs.devito_weight
    },
    {
        name: 'pound',
        multiplier: 453.59,
        divisor: Configs.devito_weight
    },
    {
        name: 'pounds',
        multiplier: 453.59,
        divisor: Configs.devito_weight
    },
    {
        name: 'oz',
        multiplier: 28.35,
        divisor: Configs.devito_weight
    },
    {
        name: 'ounce',
        multiplier: 28.35,
        divisor: Configs.devito_weight
    },
    {
        name: 'ounces',
        multiplier: 28.35,
        divisor: Configs.devito_weight
    }

]

const Units = new Map<string, Unit>();
UnitsArray.forEach(unit => {
    Units.set(unit.name, unit);

});

export { Units, Unit }