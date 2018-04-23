
const messages = require('../Common/Message')
const repository = require('../Repository/RoleRepository')


/**
 * The method can be used to execute handel errors and return to routers.
 * @param  {input} message input from custom messages.
 * @param  {input} status input false.
 * @public
 */
const errorHandler = (message, status, request) => {
    let output = {}
    output.key = message
    output.status = status
    return output
}

/**
 * The method can be used to execute getAll users
 * @param  {input} AccountId input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (input, request, callback) => {
    let output = {}
    repository.getAll(input.AccountId, (result) => {
        console.log('The result==', JSON.stringify(result))
        if (result.length > 0) {
            output.data = result
            output.status = true
            callback(output)
        } else {
            output.key = 'noDataFound'
            output.status = false
            callback(output)
        }
    })
}


module.exports = {
    getAll
}
