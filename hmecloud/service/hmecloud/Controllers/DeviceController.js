const device = require('../Repository/DeviceRepository')
const _ = require('lodash')

/**
 * The method can be used to execute getAll device by device UID
 * @param  {input} request input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAllUnregisteredDevices = (request, callBack) => {
  const input = {
    criteria: (request.query.criteria ? request.query.criteria : null),
    filter: (request.query.filter ? request.query.filter : null),
    column: (request.query.Sortby ? request.query.Sortby : null),
    sortType: (request.query.sortType ? request.query.sortType : null),
    per: (request.query.psize ? request.query.psize : null),
    pno: (request.query.pno ? request.query.pno : null)
  }

  // validator.validate(input, (err) => {
  //   if (err) {
  //     callback(err)
  //   }

  device.getunRegisterDevices(input, result => {
    console.log(result.data)
    if (result.status === true) {
      let response = {}
      response.deviceList = result.data[0]
      let pageDetails = result.data[1] || []
      response.pageDetails = pageDetails
      response.status = true
      callBack(response)
    } else {
      callBack(result)
    }
  })
}

module.exports = {
  getAllUnregisteredDevices

}
