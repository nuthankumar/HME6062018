const messages = require('../Common/Message')
const validator = require('../Validators/StoreValidator')
const deviceValidator = require('../Validators/DeviceValidator')
const stores = require('../Repository/StoresRepository')
const _ = require('lodash')

const errorHandler = (message, status) => {
  let output = {}
  output.key = message
  output.status = status
  return output
}

const settingsStores = (request, callback) => {
  const input = {
    suid: (request.query.suid ? request.query.suid : null)
  }
  validator.settingsStores(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.settingsStores(input, (result) => {
      if (result.data && result.data.length > 0) {
        let output = {}
        output.data = result.data[0]
        output.status = true
        callback(output)
      } else {
        callback(errorHandler(messages.LISTGROUP.notfound, false))
      }
    })
  })
}

const getMasterSettings = (request, callback) => {
  const input = {
    Device_ID: (request.body.Device_ID ? request.body.Device_ID : null),
    Device_LaneConfig_ID: (request.body.Device_LaneConfig_ID ? request.body.Device_LaneConfig_ID : null),
    Device_MainVersion: (request.body.Device_MainVersion ? request.body.Device_MainVersion : null),
    Store_Company_ID: (request.body.Store_Company_ID ? request.body.Store_Company_ID : null),
    Store_Brand_ID: (request.body.Store_Brand_ID ? request.body.Store_Brand_ID : null)
  }
  deviceValidator.validateMasterSettings(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.getMasterSettings(input, (result) => {
      if (result.data && result.data.length > 0) {
        let output = {}
        output.settingsList = result.data[0]
        output.destinationList = result.data[1]
        output.status = true
        callback(output)
      } else {
        callback(errorHandler(messages.LISTGROUP.notfound, false))
      }
    })
  })
}

const saveMasterSettings = (request, callback) => {
  const input = {
    Task_UID: '',
    duid: (request.body.duid ? request.body.duid : null),
    settingsList: (request.body.settingsList ? request.body.settingsList : null),
    destinationList: (request.body.destinationList ? request.body.destinationList : null)
  }
  deviceValidator.saveMasterSettings(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.saveMasterSettings(input, (result) => {
      if (result.data && result.data.length > 0) {
        let output = {}
        output.data = result.data[0]
        output.status = true
        callback(output)
      } else {
        callback(errorHandler(messages.LISTGROUP.notfound, false))
      }
    })
  })
}

const checkMergeDevices = (request, callback) => {
  const input = {
    suids: (request.body.suid ? request.body.suidList : null),
    duid: (request.body.duid.length ? request.body.duid : null)
  }
  deviceValidator.mergePreValidator(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.checkMergeDevices(input, (result) => {
      if (result.data && result.data.length > 0) {
        let output = {}
        output.data = result.data[0]
        output.status = true
        callback(output)
      } else {
        callback(errorHandler(messages.LISTGROUP.notfound, false))
      }
    })
  })
}

const mergeDevicesInfo = (request, callback) => {
  const input = {
    suids: (request.body.suid ? request.body.suidList : null),
    duid: (request.body.duid.length ? request.body.duid : null)
  }
  deviceValidator.mergePreValidator(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.mergeDevicesInfo(input, (result) => {
      if (result.data && result.data.length > 0) {
        let output = {}
        output.data = result.data[0]
        output.status = true
        callback(output)
      } else {
        callback(errorHandler(messages.LISTGROUP.notfound, false))
      }
    })
  })
}

const saveMergeDevices = (request, callback) => {
  const input = {
    suid: (request.params.suid ? request.params.suid : null),
    device_Merge_List: (request.params.device_Merge_List.length ? request.params.device_Merge_List : null),
    tempDevice_Merge_List: (request.params.tempDeviceMergeUIDs.length ? request.params.tempDeviceMergeUIDs : null),
    isReplacement: 1
  }
  deviceValidator.saveMergeDevices(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.saveMergeDevices(input, (result) => {
      if (result.data && result.data.length > 0) {
        let output = {}
        output.data = result.data[0]
        output.status = true
        callback(output)
      } else {
        callback(errorHandler(messages.LISTGROUP.notfound, false))
      }
    })
  })
}

const unRegisterDevicesSearch = (request, callback) => {
  const input = {
    suid: (request.params.suid ? request.params.suid : null),
    device_Merge_List: (request.params.device_Merge_List.length ? request.params.device_Merge_List : null),
    tempDevice_Merge_List: (request.params.tempDeviceMergeUIDs.length ? request.params.tempDeviceMergeUIDs : null),
    isReplacement: 1
  }
  deviceValidator.unRegisterDevicesSearch(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.unRegisterDevicesSearch(input, (result) => {
      if (result.data && result.data.length > 0) {
        let output = {}
        output.data = result.data[0]
        output.status = true
        callback(output)
      } else {
        callback(errorHandler(messages.LISTGROUP.notfound, false))
      }
    })
  })
}

/**
 * The method can be used to execute getAll store by user UID
 * @param  {input} request input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAllStores = (request, callBack) => {
  const input = {
    userUid: (request.userUid ? request.userUid : null),
    criteria: (request.query.criteria ? request.query.criteria : null),
    isAdmin: (request.query.isAdmin ? request.query.isAdmin : null),
    filter: (request.query.filter ? request.query.filter : null),
    column: (request.query.column ? request.query.Sortby : null),
    sortType: (request.query.sortType ? request.query.sortType : null),
    per: (request.query.psize ? request.query.psize : null),
    pno: (request.query.pno ? request.query.pno : null)
  }

  // validator.validate(input, (err) => {
  //   if (err) {
  //     callback(err)
  //   }

  stores.getStores(input, result => {
    if (result.status === true) {
      let response = {}
      let storeList = []
      _.map(_.groupBy(result.data[0], 'Store_UID'), function (store, key) {
        let storeObject = {}
        let DeviceDetails = []
        store.forEach(element => {
          let deviceObject = {}
          _.map(element, function (value, key) {
            if (key.indexOf('Device') > -1 || key.indexOf('Subscription_Name') > -1) {
              deviceObject[key] = value
            } else {
              storeObject[key] = value
            }
          })
          DeviceDetails.push(deviceObject)
        })
        storeObject.Device_Details = DeviceDetails
        storeList.push(storeObject)
      })
      response.storeList = storeList
      if (input.isAdmin === 1) {
        let pageDetails = result.data[1] || []
        response.pageDetails = pageDetails
      } else {
        let permessions = _.compact(_.map(result.data[1], 'Permission_Name')) || []
        response.userPermessions = permessions
      }
      response.status = true
      callBack(response)
    } else {
      callBack(result)
    }
  })
}

/**
 * The method can be used to execute get store by store UID
 * @param  {input} request input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getStoreByUid = (request, callBack) => {
  const input = {
    suid: (request.query.suid ? request.query.suid : null)
  }

  stores.getStoreByUid(input, result => {
    if (result.status === true) {
      let response = {}
      if (result.data[0][0].Brand_Name === 'NA') {
        response.key = 'noRecordsFound'
      } else {
        response.storeDetails = result.data[0][0]
        response.storeDetails.timeZone = _.map(result.data[1], 'Name')
        if (result.data[2][0].Device_Name === 'NA') {
          response.deviceDetails = {}
        } else {
          response.Device_Details = result.data[2] || []
          // if (_.has(response, 'deviceDetails.CIB')) {
          //   let Email = _.get(response, 'storeDetails.User_EmailAddress')
          //   _.set(response, 'deviceDetails.CIB.0.Email', Email) // set Email for CIB settings
          // }
        }
      }
      response.status = true
      callBack(response)
    } else {
      callBack(result)
    }
  })
}

/**
 * @param {*} input
 * @param {*} response
 */
const removeDeviceById = (request, callBack) => {
  const input = {
    suid: (request.query.duid ? request.query.duid : null)
  }

  stores.removeDeviceById(input, result => {
    if (result.status === true) {
      callBack(result)
    } else {
      callBack(result)
    }
  })
}
module.exports = {
  settingsStores,
  getMasterSettings,
  saveMasterSettings,
  checkMergeDevices,
  mergeDevicesInfo,
  saveMergeDevices,
  getAllStores,
  getStoreByUid,
  removeDeviceById,
  unRegisterDevicesSearch
}
