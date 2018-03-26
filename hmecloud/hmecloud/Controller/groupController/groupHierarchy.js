/**
 * Using this file Manage the Group Hierachy level - stores and groups
 * Operation : Basic CURD App
 */

// config the model
let Sequelize = require('sequelize');
 Sequelize = new Sequelize('test', 'admin', 'digitalpwd', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    port: 23306
});
const group = require('../../Model/groupModel/groupTabel')
const groupDetails = require('../../Model/groupModel/groupdetails')
// Config messages
const messages = require('../../common/message')



// get functions using accountid & name  - for the List

const list = (input, callback) => {
    const condition = {
        where: {
            accountId: input.accountId,
            createdBy: input.createdBy
        }
    }
    group.findAll(condition)
        .then(result => {
            const output = {}
            if (result.length > 0) {
                output.data = result
                output.status = true
            } else {
                output.data = 'notfound'
                output.status = false
            }

            callback(output)
        }).catch(error => {
            const output = {
                data: error,
                status: false
            }
            callback(output)
        })
}

// create function

const create = (input, callback) => {
    const output = {};
    const Query = "SELECT COUNT(*) as count FROM `group` WHERE groupName='" + input.name + "' AND accountId=" + 0 // toDO: input.accountId update this
    const condition = {
        where: {
            groupName: input.name,
            accountId: 0  // toDO: input.accountId update this
         }
    }

    group.findAndCountAll(condition).then(count => {
       if (count.count === 0) {
            group.create({
                groupName: input.name,
                description: input.description,
                accountId: input.accountId,
                createdBy: 1000,
                updatedBy: 1000,
                createdDateTime: new Date().now,
                updatedDateTime: new Date().now
            }).then(result => {
                if (input.groups.length > 0 || input.stores.length > 0) {
                    let maxSize = (input.groups.length > input.stores.length) ? input.groups.length : input.stores.length;
                    for (var i = 0; i < maxSize; i++) {
                        const grpDetailOut = groupDetails.create({
                            groupId: result.toJSON().id,
                            childGroupId: (input.groups[i] != undefined) ? input.groups[i] : null,
                            storeId: (input.stores[i] != undefined) ? input.stores[i] : null
                        }).then(result1 => {
                            output.data = messages.CREATEGROUP.groupSuccess1 + input.name + messages.CREATEGROUP.groupSuccess2,
                                output.status = true
                            callback(output);
                        }).catch(error1 => {
                            output.data = error1,
                                output.status = false

                            callback(output)
                        });
                    }
                }
            }).catch(error => {
                output.data = error,
                    output.status = false

                callback(output)
            });
        } else {
           output.data = input.name+messages.CREATEGROUP.groupAlreadyExist,
          output.status = false

          callback(output)
        }

    }).catch(error1 => {
        output.data = error,
            output.status = false

        callback(output)
    });

   
}

const getgroupDetails = (input, callback) => {
    let output = {};

    const condition = {
        where: {
            id: input.groupId,
            createdBy: input.userName
        }
    }
    group.findOne(condition).then(result => {

        if (result) {

            // Getting the child Group and Store details
            const Query = "SELECT g.Id, g.groupName,'group' AS type FROM `group` g INNER JOIN groupdetails gd ON g.id = gd.childGroupId WHERE gd.groupId =" + input.groupId + " AND g.createdBy = '" + input.userName + "'";
            Sequelize.query(Query, { type: Sequelize.QueryTypes.SELECT }).then(result1 => {
                if (result1) {
                    output.data = ({ group: result, details: result1 });
                    output.status = true;

                    callback(output)
                }

            }).catch(error1 => {
                output.data = error,
                    output.status = false

                callback(output)
            });

        } else {
            output.data = 'Data notfound'
            output.status = false
        }



    }).catch(error => {

        output.data = error,
            output.status = false

        callback(output)
    });
};

/*
Deletes Group and its sub groups from table
@param   inputs [groupId and accountId ]
@param callBack
*/
const deleteGroupById = (input, callBack) => {
    const updateChildGroupId = {
        childGroupId: null
    };

    groupDetails
        .update(updateChildGroupId, {
            where: { childGroupId: input.groupId }
        })
        .then(updatedRows => {
            console.log(updatedRows);
        });

    group
        .destroy({
            where: {
                accountId: input.accountId,
                id: input.groupId
            }
        })
        .then((result) => {
            const output = {
                data: result,
                status: true
            };
            return callBack(output);
        })
        .catch((error) => {
            const output = {
                data: error,
                status: false
            };
            return callBack(output);
        });
    //return output;
};



module.exports = {
    list,
    create,
    getgroupDetails,
    deleteGroupById
}