const Sequelize = require('sequelize')
const db = require('../db/configDb')

const group = db.define('group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    groupName: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING,
    },
    accountId: {
        type: Sequelize.INTEGER,
    },
    createdBy: {
        type: Sequelize.INTEGER,
    },
    updatedBy: {
        type: Sequelize.INTEGER,
    },
    createdDateTime: {
        type: Sequelize.DATE,
        default: Date.now
    },
    updatedDateTime: {
        type: Sequelize.DATE,
        default: Date.now
    },

}, {
        tableName: 'group',
        timestamps: false,
        freezeTableName: true
    });

group.associate = (models) => {
    models.group.hasMany(models.groupdetails, { onSave: 'cascade', onDelete: 'cascade', hooks: true, constraints: true });
}

module.exports=group
