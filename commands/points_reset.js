const Stat = require('../models/Stat');
const {stats_id} = require('../config/configs');

module.exports = {
    name: "points_reset",
    description: '',
    cooldown: 10,
    usage: '',
    admin:true,
    args: false,
    async execute(message,arg) {

        Stat.findById(stats_id).then( stat=>{
            if(!stat)
                return;
                
            stat.points.push({
                gryffindor:0,
                slytherin:0,
                ravenclaw:0,
                hufflepuff:0
            });

            stat
            .save()
            .then(stat=> {
                console.log(`A new has begun! All house points are reset.`);
            })
            .catch(err=> console.log(err));
            
        })
        .catch(err=>console.log(err));
    },
};