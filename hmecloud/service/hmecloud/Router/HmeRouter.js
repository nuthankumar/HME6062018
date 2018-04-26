/**
 * This function will be used to handle the response to send back standard format
 * @param  {endpoint} handelResult function name
 * @param  {funct} result  check JWT authentication
 * @param  {request} response  from  user request
 * @public
 */
const handelResult = (result, response) => {
    if (result.status === true) {
        response.status(200).send(result)
    } else {
        response.status(204).send(result)
    }
}

module.exports = {
    handelResult
}