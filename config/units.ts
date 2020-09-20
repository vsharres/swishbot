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
        divisor: Configs.height
    },
    {
        name: 'meters',
        multiplier: 100,
        divisor: Configs.height
    },
    {
        name: 'meter',
        multiplier: 100,
        divisor: Configs.height
    },
    {
        name: 'metre',
        multiplier: 100,
        divisor: Configs.height
    },
    {
        name: 'metres',
        multiplier: 100,
        divisor: Configs.height
    },
    {
        name: 'cm',
        multiplier: 1,
        divisor: Configs.height
    },
    {
        name: 'centimeters',
        multiplier: 1,
        divisor: Configs.height
    },
    {
        name: 'centimetres',
        multiplier: 1,
        divisor: Configs.height
    },
    {
        name: 'centimeter',
        multiplier: 1,
        divisor: Configs.height
    },
    {
        name: 'centimetre',
        multiplier: 1,
        divisor: Configs.height
    },
    {
        name: 'km',
        multiplier: 100000,
        divisor: Configs.height
    },
    {
        name: 'kilometers',
        multiplier: 100000,
        divisor: Configs.height
    },
    {
        name: 'kilometer',
        multiplier: 100000,
        divisor: Configs.height
    },
    {
        name: 'kilometres',
        multiplier: 100000,
        divisor: Configs.height
    },
    {
        name: 'kilometre',
        multiplier: 100000,
        divisor: Configs.height
    },
    {
        name: 'yd',
        multiplier: 91.44,
        divisor: Configs.height
    },
    {
        name: 'yard',
        multiplier: 91.44,
        divisor: Configs.height
    },
    {
        name: 'yards',
        multiplier: 91.44,
        divisor: Configs.height
    },
    {
        name: 'mi',
        multiplier: 160934,
        divisor: Configs.height
    },
    {
        name: 'mile',
        multiplier: 160934,
        divisor: Configs.height
    },
    {
        name: 'miles',
        multiplier: 160934,
        divisor: Configs.height
    },
    {
        name: 'ly',
        multiplier: 1.057e18,
        divisor: Configs.height
    },
    {
        name: 'light-year',
        multiplier: 1.057e18,
        divisor: Configs.height
    },
    {
        name: 'light-years',
        multiplier: 1.057e18,
        divisor: Configs.height
    },
    {
        name: 'pc',
        multiplier: 3.24078e19,
        divisor: Configs.height
    },
    {
        name: 'parsec',
        multiplier: 3.24078e19,
        divisor: Configs.height
    },
    {
        name: 'parsecs',
        multiplier: 3.24078e19,
        divisor: Configs.height
    },
    {
        name: 'g',
        multiplier: 1,
        divisor: Configs.weight
    },
    {
        name: 'gram',
        multiplier: 1,
        divisor: Configs.weight
    },
    {
        name: 'grams',
        multiplier: 1,
        divisor: Configs.weight
    },
    {
        name: 'kg',
        multiplier: 1000,
        divisor: Configs.weight
    },
    {
        name: 'kilogram',
        multiplier: 1000,
        divisor: Configs.weight
    },
    {
        name: 'kilograms',
        multiplier: 1000,
        divisor: Configs.weight
    },
    {
        name: 't',
        multiplier: 1000000,
        divisor: Configs.weight
    },
    {
        name: 'tonne',
        multiplier: 1000000,
        divisor: Configs.weight
    },
    {
        name: 'tonnes',
        multiplier: 1000000,
        divisor: Configs.weight
    },
    {
        name: 'lb',
        multiplier: 453.59,
        divisor: Configs.weight
    },
    {
        name: 'pound',
        multiplier: 453.59,
        divisor: Configs.weight
    },
    {
        name: 'pounds',
        multiplier: 453.59,
        divisor: Configs.weight
    },
    {
        name: 'oz',
        multiplier: 28.35,
        divisor: Configs.weight
    },
    {
        name: 'ounce',
        multiplier: 28.35,
        divisor: Configs.weight
    },
    {
        name: 'ounces',
        multiplier: 28.35,
        divisor: Configs.weight
    },

]

const Units = new Map<string, Unit>();
UnitsArray.forEach(unit => {
    Units.set(unit.name, unit);

});

export { Units }