const messages = require('../Common/Message')
const validator = require('../Validators/StoreValidator')
const deviceValidator = require('../Validators/DeviceValidator')
const stores = require('../Repository/StoresRepository')
const dateUtils = require('../Common/DateUtils')
const dateFormat = require('dateformat')
const csvGeneration = require('../Common/CsvUtils')
const HashMap = require('hashmap')
const _ = require('lodash')

const errorHandler = (message, status) => {
  let output = {}
  output.key = message
  output.status = status
  return output
}
/**
 * This Service is used to Generate the Summary reports details for
 *provided details
 * @param request
 * @param response
 *
 */
const generateReport = (input, callBack) => {
  if (input !== null) {
    stores.generateSummaryReport(input, result => {
      if (result.status === true) {
        callBack(result)
      } else {
        callBack(result)
      }
    })
  } else {
    callBack(messages.CREATEGROUP.invalidRequestBody)
  }
}

/**
 *  This service is used to get the Raw Car Data details
 * @param {*} input
 * @param {*} callBack
 */
const getRawCarDataReport = (input, callBack) => {
  let fromDateTime = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)

  let toDateTime = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)

  const rawCarDataqueryTemplate = {
    ReportTemplate_DeviceIds: input.ReportTemplate_DeviceIds,
    ReportTemplate_From_Date: input.ReportTemplate_From_Date,
    ReportTemplate_To_Date: input.ReportTemplate_To_Date,
    fromDateTime: fromDateTime,
    toDateTime: toDateTime,
    ReportTemplate_Type: 11, // input.CarDataRecordType_ID,
    ReportType: input.ReportTemplate_Type,
    LaneConfig_ID: 1
  }
  const rawCarDataList = []
  const rawCarData = {}
  const departTimeStampMap = new HashMap()

  if (input.reportType === 'rr1' || input.reportType === 'rrcsv1') {
    stores.getRawCarDataReport(rawCarDataqueryTemplate, result => {
      if (!_.isEmpty(result)) {
        const len = result.length
        if (len > 1) {
          const dayPartData = result[1]
          let counter = 0
          _.mapKeys(result, function (value, key) {
            if (_.has(value, 'Store_Name')) {
              prepareStoreDetails(rawCarData, value, input)
            }

            if (value.DepartTimeStamp === null || value.DepartTimeStamp === undefined) {
              counter++
              if (counter === len) {
                rawCarData.status = true
                rawCarData.key = 'ReportsNoRecordsFound'
                callBack(rawCarData)
              }
            }
          })

          prepareResponsObject(result, departTimeStampMap, rawCarDataList, rawCarData, len, dayPartData, input)
          rawCarData.rawCarData = rawCarDataList

          if (input.reportType === 'rr1') {
            rawCarData.status = true
            callBack(rawCarData)
          } else if (input.reportType === 'rrcsv1') {
            // Invoking CSV file generation function
            let output = {}
            let csvInput = {}
            csvInput.type = messages.COMMON.CSVTYPE
            csvInput.reportName = input.ReportTemplate_Time_Measure + '_' + dateFormat(new Date(), 'isoDate')
            csvInput.email = input.UserEmail
            csvInput.reportinput = rawCarDataList
            csvInput.subject = input.ReportTemplate_Time_Measure + ' ' + fromDateTime + ' - ' + toDateTime
            csvGeneration.generateCsvAndEmail(csvInput, result => {
              if (result) {
                output.data = input.UserEmail
                output.status = true
              } else {
                output.data = input.UserEmail
                output.status = false
              }

              callBack(output)
            })
          }
        }
      } else {
        callBack({
          key: 'ReportsNoRecordsFound',
          status: false
        })
      }
    })
  } else {
    callBack({
      key: 'invalidReportType',
      status: false
    })
  }
}

/**
 *
 * @param {*} input
 * @param {*} response
 */
const generateCsv = (input, response) => {
  stores.generateCSV(input, result => {
    if (result.status === true) {
      response.status(200).send(result)
    } else {
      response.status(400).send(result)
    }
  })
}
/**
 *
 * @param {*} rawCarData
 * @param {*} storeData
 * @param {*} input
 */
function prepareStoreDetails(rawCarData, storeData, input) {
  rawCarData.storeName = storeData.Store_Name
  rawCarData.storeDescription = storeData.Brand_Name
  rawCarData.storeNumber = (storeData.Store_Number ? storeData.Store_Number : 'N/A')
  rawCarData.startTime = `${dateUtils.convertMMMdYYYY(input.ReportTemplate_From_Date)}`
  rawCarData.stopTime = `${dateUtils.convertMMMdYYYY(input.ReportTemplate_To_Date)}`
  rawCarData.printDate = dateUtils.convertMMMdYYYY(dateFormat(new Date(), 'isoDate'))
  rawCarData.printTime = dateFormat(new Date(), 'shortTime')

  return rawCarData
}
/**
 *
 * @param {*} result
 * @param {*} departTimeStampMap
 * @param {*} rawCarDataList
 * @param {*} rawCarData
 * @param {*} len
 * @param {*} dayPartData
 * @param {*} input
 */
function prepareResponsObject(result, departTimeStampMap, rawCarDataList, rawCarData, len, dayPartData, input) {
  result.forEach(item => {
    let rawCarTempId = item.RawDataID
    if (rawCarTempId && !departTimeStampMap.has(rawCarTempId)) {
      let departTimeStampList = result.filter(function (obj) {
        return obj.RawDataID === rawCarTempId
      })
      let tempRawCarData = departTimeStampList[0]

      const rawCarDataObj = {}
      rawCarDataObj.departureTime = dateUtils.UtcTimeTo12HourFormat(tempRawCarData.DepartTimeStamp)
      rawCarDataObj.eventName = tempRawCarData.CarRecordDataType_Name || 'N/A'
      rawCarDataObj.carsInQueue = tempRawCarData.CarsInQueue || '0'

      rawCarData.dayPart = 'DP' + tempRawCarData.Daypart_ID + dateUtils.dayPartTime(tempRawCarData.Daypart_ID, input)

      for (let i = 0; i < departTimeStampList.length; i++) {
        let tempEventDetails = departTimeStampList[i]
        if (tempEventDetails.EventType_Name.includes(messages.EventName.MENU)) {
          rawCarDataObj.menu = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        } else if (tempEventDetails.EventType_Name.includes(messages.EventName.GREET)) {
          rawCarDataObj.laneQueue = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        } else if (tempEventDetails.EventType_Name.includes(messages.EventName.SERVICE)) {
          rawCarDataObj.laneTotal = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        } else if (tempEventDetails.EventType_Name.includes(messages.EventName.LANEQUEUE)) {
          rawCarDataObj.service = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        } else if (tempEventDetails.EventType_Name.includes(messages.EventName.LANETOTAl)) {
          rawCarDataObj.greet = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        }
      }
      rawCarDataList.push(rawCarDataObj)
      departTimeStampMap.set(rawCarTempId, rawCarTempId)
    }
  })
  return rawCarDataList
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
        
        output.systemStatus = result.data[0];
        let grouppedArray =_.groupBy(result.data[1],'SettingsGroup_Name')
        _.keys(grouppedArray).forEach(function (key, value) {
            let settingsObj = {};
            settingsObj.name = key;
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
    deviceId: (request.query.deviceId ? request.query.deviceId : null),
    Device_LaneConfig_ID: (request.query.Device_LaneConfig_ID ? request.query.Device_LaneConfig_ID : null),
    Device_MainVersion: (request.query.Device_MainVersion ? request.query.Device_MainVersion : null),
    Store_Company_ID: (request.query.Store_Company_ID ? request.query.Store_Company_ID : null),
    Store_Brand_ID: (request.query.Store_Brand_ID ? request.query.Store_Brand_ID : null)
  }
  deviceValidator.validateMasterSettings(input, (err) => {
    if (err) {
      callback(err)
    }
    stores.getMasterSettings(input, (result) => {
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

const saveMasterSettings = (request, callback) => {
  const input = {
    duid: (request.params.duid ? request.params.duid : null),
    settings: (request.params.settings.length ? request.params.settings : null),
    destination: (request.params.destination.length ? request.params.destination : null)
  }
  storeValidator.saveMasterSettings(input, (err) => {
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

const saveMergeDevices = (request, callback) => {
  const input = {
    suid: (request.params.suid ? request.params.suid : null),
    device_Merge_List: (request.params.device_Merge_List.length ? request.params.device_Merge_List : null),
    tempDevice_Merge_List: (request.params.tempDeviceMergeUIDs.length ? request.params.tempDeviceMergeUIDs : null),
    isReplacement: 1
  }
  storeValidator.saveMergeDevices(input, (err) => {
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
    per: (request.query.per ? request.query.psize : null),
    pno: (request.query.pno ? request.query.pno : null)
  }

  // validator.validate(input, (err) => {
  //   if (err) {
  //     callback(err)
  //   }

  stores.getStores(input, result => {
    if (result.status === true) {
      let response = {}
      let storeList = [] // _.groupBy(result.data[0], 'Store_UID')

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

  // storeValidator.validateStoreUID(input, (err) => {
  //   if (err) {
  //     console.log('err', err)
  //     callBack(err)
  //   }
  // })

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
          response.deviceDetails = _.groupBy(result.data[2], 'Device_Name')
          if (_.has(response, 'deviceDetails.CIB')) {
            let Email = _.get(response, 'storeDetails.User_EmailAddress')
            _.set(response, 'deviceDetails.CIB.0.Email', Email) // set Email for CIB settings
          }
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
  generateReport,
  generateCsv,
  getRawCarDataReport,
  settingsDevices,
  settingsStores,
  getMasterSettings,
  saveMasterSettings,
  saveMergeDevices,
  getAllStores,
  getStoreByUid,
  removeDeviceById
}
