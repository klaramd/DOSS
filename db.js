
const Sequelize = require('sequelize');

const sequelize = new Sequelize('sqlite:my-database.db');

const User = sequelize.define('user', {
    userName: {
        type: Sequelize.STRING
    },
    pw: {
        type: Sequelize.STRING
    },
    city: {
        type: Sequelize.STRING
    },
    birthday: {
        type: Sequelize.STRING
    }

});


const Training = sequelize.define('training', {
	startDate: {
        type: Sequelize.STRING
	},
	startTime: {
        type: Sequelize.STRING
	},
    endDate: {
        type: Sequelize.STRING
    },
    endTime: {
        type: Sequelize.STRING
    },
	description: {
		type: Sequelize.STRING
	}
});




const Weight = sequelize.define('weight',{

	weightDate: {
		type: Sequelize.STRING
	},
	weightKG: {
		type: Sequelize.INTEGER
	}
});



User.hasMany(Weight)
User.hasMany(Training)

sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});



exports.Training = Training;
exports.Weight = Weight;
exports.User = User;

//Ent-kommentieren
//sequelize.sync({force: true});