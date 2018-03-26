const Sequelize = require('sequelize')
const db = require('../db/configDb')

const groupdetails = db.define('groupdetails',{
    id: {
        type: Sequelize.INTEGER,
         autoIncrement: true,
          primaryKey: true
    },
    groupId: {
        type: Sequelize.INTEGER,
    },
    childGroupId: {
        type: Sequelize.INTEGER,
    },
    storeId: {
        type: Sequelize.INTEGER,
    }
}, {
        tableName: 'groupdetails',
        timestamps: false,
        freezeTableName: true
    });

groupdetails.associate = (models) => {
    models.groupdetails.belongsTo(models.group);
}

module.exports = groupdetails
