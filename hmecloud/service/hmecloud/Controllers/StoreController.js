const messages = require('../Common/Message')
const validator = require('../Validators/StoreValidator')
const deviceValidator = require('../Validators/DeviceValidator')
const stores = require('../Repository/StoresRepository')
const webService = require('../Common/WebService')
const _ = require('lodash')
const dateFormat = require('dateformat')
const csvGeneration = require('../Common/CsvUtils')

const errorHandler = (message, status) => {
  let output = {}
  output.key = message
  output.status = status
  return output
}

const settingsDevices = (request, callback) => {
  const input = {
    duid: (request.query.duid ? request.query.duid : null)
  }

  deviceValidator.validateDevice(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.settingsDevices(input, (result) => {
      if (result.data && result.data.length > 0) {
        let output = {}
        var tempSettingsArray = []
        output.systemStatus = result.data[0]
        output.totalDevices = result.data[1][0].SettingsCount
        let grouppedArray = _.groupBy(result.data[2], 'SettingsGroup_Name')
        _.keys(grouppedArray).forEach(function (key, value) {
          let settingsObj = {}
          settingsObj.name = key
          settingsObj.value = grouppedArray[key]
          tempSettingsArray.push(settingsObj)
        })
        output.systemSettings = tempSettingsArray
        output.status = true
        callback(output)
      } else {
        callback(errorHandler(messages.LISTGROUP.notfound, false))
      }
    })
  })
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
    duid: (request.body.duid ? request.body.duid : null),
    settingsList: (request.body.settingsList ? request.body.settingsList : null),
    destinationList: (request.body.destinationList ? request.body.destinationList : null),
    userEmailId: (request.body.emailId ? request.body.emailId : null)
  }
  deviceValidator.saveMasterSettings(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.saveMasterSettings(input, (result) => {
      console.log('result', result.data);
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

const generateCSV = (result, request, callback) => {
  let csvData = []
  let csvInput = {}
  _.forEach(result, (item) => {
    let output = {}
    item.Device_Name ? output.System = item.Device_Name : output.System = null
    item.Device_SerialNumber ? output['Serial Number'] = item.Device_SerialNumber : output.Device_SerialNumber = null
    item.Device_MainVersion ? output['Firmware Version'] = item.Device_MainVersion : output['Firmware Version'] = null
    item.LaneConfig_Name ? output['Lane Config'] = item.LaneConfig_Name : output['Lane Config'] = null
    csvData.push(output)
  })
  csvInput.type = `${messages.COMMON.CSVTYPE}`
  csvInput.reportName = `${messages.COMMON.UNREGISTERED} ${dateFormat(new Date(), 'isoDate')}`
  csvInput.email = request.UserEmail
  csvInput.subject = `${messages.COMMON.UNREGISTEREDTITLE} `
  csvInput.reportinput = csvData
  csvGeneration.generateCsvAndEmail(csvInput, csvOutput => {
    let output = {}
    if (csvOutput) {
      output.data = request.UserEmail
      output.status = true
    } else {
      output.data = request.UserEmail
      output.status = false
    }
    callback(output)
  })
}
/**
 * The method can be used to execute get unRegisterDevices
 * @param  {input} request input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const unRegisterDevicesSearch = (request, callback) => {
  const input = {
    criteria: (request.query.criteria ? request.query.criteria : null),
    filter: (request.query.filter ? request.query.filter : null),
    SortingColumnName: (request.query.Sortby ? request.query.Sortby : 'Store_Number'),
    sortType: (request.query.sortType ? request.query.sortType : 'ASC'),
    RecordPerPage: (request.query.psize ? request.query.psize : 10),
    PageNumber: (request.query.pno ? request.query.pno : 1)
  }
  if (!_.isUndefined(request.query.reportType) && (request.query.reportType.toLowerCase().trim() === 'csv')) {
    input.PageNumber = 0
  }
  deviceValidator.unRegisterDevicesSearch(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.unRegisterDevicesSearch(input, (result) => {
      if (result.data && result.data.length > 0) {
        if (!_.isUndefined(request.query.reportType) && (request.query.reportType.toLowerCase().trim() === 'reports')) {
          let output = {}
          output.data = result.data[0]
          output.status = true
          callback(output)
        } else if (!_.isUndefined(request.query.reportType) && (request.query.reportType.toLowerCase().trim() === 'csv')) {
          generateCSV(result.data[0], request, csvResult => {
            callback(csvResult)
          })
        }
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
    isAdmin: (parseInt(request.query.isAdmin) ? parseInt(request.query.isAdmin) : null),
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
        let pageDetails = result.data[1][0] || []
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
        if (result.data[1][0].Device_Name === 'NA') {
          response.deviceDetails = {}
        } else {
          response.Device_Details = result.data[1] || []
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

      // :TODO webservice call being done for remote execution
      // let response = result.data[0]
      // let url = `${process.env.RemoteExecutionEndPoint}
      //     ?deviceId=${response.deviceId}
      //     &deviceUID=${response.deviceId}
      //     &deviceVersion=${response.deviceId}
      //     &storeID=${response.deviceId}`
      // webService.getcall(url)

      callBack(result)
    } else {
      callBack(result)
    }
  })
}

/**
 * The method can be used to execute save store by store UID
 * @param  {input} request input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const saveStoreDetails = (request, callBack) => {
  console.log('hi')
  const input = {
    isAdmin: (request.query.isAdmin ? request.query.isAdmin : null),
    suid: (request.body.suid ? request.body.suid : null),
    storeNumber: (request.body.StoreNumber ? request.body.StoreNumber : null),
    storeID: (request.body.StoreID ? request.body.StoreID : null),
    storeName: (request.body.StoreName ? request.body.StoreName : null),
    companyId: (request.body.Company_ID ? request.body.Company_ID : null),
    timeZone: (request.body.timeZone ? request.body.timeZone : null)
    // Format to be mapped
    // {"StoreNumber":"Store X","StoreUID":"C5B3795ACA0A4612A961A36B39DC6C5D","StoreName":"123"}
  }

  if (input.isAdmin === 0) {
    let azure = {}
    azure.StoreNumber = input.storeNumber
    azure.StoreUID = input.storeNumber
    azure.StoreName = input.storeName
    input.AzureData = azure
  }
  stores.saveStoreDetails(input, result => {
    let response = {}
    console.log(result)
    if (result) {
      if (result.data.length > 0) {
        response = result.data[0][0]
        response.status = true
        callBack(response)
      } else {
        response = 'noUpdation'
        response.status = true
      }
    } else {
      result.status = false
      callBack(result)
    }
  })
}

module.exports = {
  settingsDevices,
  settingsStores,
  getMasterSettings,
  saveMasterSettings,
  checkMergeDevices,
  mergeDevicesInfo,
  saveMergeDevices,
  getAllStores,
  getStoreByUid,
  removeDeviceById,
  unRegisterDevicesSearch,
  saveStoreDetails
}
