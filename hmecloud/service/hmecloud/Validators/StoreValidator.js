const validate = require('validator')
const storeController = require('../Controllers/StoreController')
const dayReportController = require('../Controllers/DayReportController')
const dayPartReportController = require('../Controllers/DayPartReportController')
const weekReportController = require('../Controllers/WeekReportController')
const dateUtils = require('../Common/DateUtils')

const reportValidator = (request, callback) => {
  let output = {}

  if (request.body.deviceIds.length > 0) {
    const input = {
      ReportTemplate_DeviceIds: request.body.deviceIds, //  [] array of object
      ReportTemplate_Advanced_Op: request.body.advancedOptions, // boolean
      ReportTemplate_Time_Measure: request.body.timeMeasure, // number
      ReportTemplate_From_Date: request.body.fromDate, // string date
      ReportTemplate_To_Date: request.body.toDate, // string date
      ReportTemplate_From_Time: request.body.openTime, // hours:min AM/PM
      ReportTemplate_To_Time: request.body.closeTime, // hours:min AM/PM
      ReportTemplate_Open: request.body.open, // boolean
      ReportTemplate_Close: request.body.close, // boolean
      ReportTemplate_Type: request.body.type, // number
      longestTime: request.body.longestTime, // boolean
      systemStatistics: request.body.systemStatistics, // boolean
      ReportTemplate_Format: request.body.format, // number
      reportType: request.query.reportType,
      userUid: request.userUid,
      UserEmail: request.UserEmail,
      CarDataRecordType_ID: request.UserPreferenceValue,
      recordPerPage: request.body.recordPerPage,
      pageNumber: request.body.pageNumber
    }

    // if advance option true and open/ close is true report type can be 2=TC
    // longest and system statistic disalbled and should be false
    if (input.ReportTemplate_DeviceIds.length > 250) {
      output.key = 'storeSelectionInvalid'
      output.status = false
      callback(output)
    }

    if (input.ReportTemplate_Advanced_Op &&
          (input.ReportTemplate_Open || input.ReportTemplate_Close)) {
      if (input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(93, input.ReportTemplate_From_Date)) {
        output.key = 'advancedDateRangeInvalid'
        output.status = false
        callback(output)
      }

      if (input.ReportTemplate_Type === 1) {
        input.ReportTemplate_Type = 'TC'
      }
    }
    if (input.ReportTemplate_Type === 2) {
      input.ReportTemplate_Type = 'AC'
    }
    // If date range is null
    if (!input.ReportTemplate_From_Date || !input.ReportTemplate_To_Date) {
      output.key = 'dateCannotbeEmpty'
      output.status = false
      callback(output)
    }

    if (input.ReportTemplate_From_Date > input.ReportTemplate_To_Date) {
      output.key = 'formDateGreaterThanToDate'
      output.status = false
      callback(output)
    }

    // report time measure day data
    if (input.ReportTemplate_Time_Measure === 1) {
      if (!input.ReportTemplate_Advanced_Op && input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(31, input.ReportTemplate_From_Date)) {
        output.key = 'dayInvalidDateRange'
        output.status = false
        callback(output)
      }
      if (input.ReportTemplate_Advanced_Op &&
          input.ReportTemplate_DeviceIds.length > 100 &&
          input.ReportTemplate_DeviceIds.length < 250 &&
              input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(31, input.ReportTemplate_From_Date)) {
        output.key = 'advancedDayInvalidDateRange'
        output.status = false
        callback(output)
      }
      dayReportController.generateDayReportByDate(request, input, result => {
        callback(result)
      })
      // report time measure day part data
    } else if (input.ReportTemplate_Time_Measure === 2) {
      if (!input.ReportTemplate_Advanced_Op && input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(14, input.ReportTemplate_From_Date)) {
        output.key = 'dayPartInvalidDateRange'
        output.status = false
        callback(output)
      }
      if (input.ReportTemplate_Advanced_Op &&
          input.ReportTemplate_DeviceIds.length > 100 &&
          input.ReportTemplate_DeviceIds.length < 250 &&
              input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(21, input.ReportTemplate_From_Date)) {
        output.key = 'advancedDateRangeDayPartInvalid'
        output.status = false
        callback(output)
      }
      dayPartReportController.generateDaypartReport(request, input, result => {
        callback(result)
      })
      // report time measure week data
    } else if (input.ReportTemplate_Time_Measure === 3) {
      if (!input.ReportTemplate_Advanced_Op &&
              input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(62, input.ReportTemplate_From_Date)) {
        output.key = 'weekInvalidDateRange'
        output.status = false
        callback(output)
      }
      if (input.ReportTemplate_Advanced_Op &&
          input.ReportTemplate_DeviceIds.length > 100 &&
          input.ReportTemplate_DeviceIds.length < 250 &&
              input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(21, input.ReportTemplate_From_Date)) {
        output.key = 'advancedDateRangeWeekInvalid'
        output.status = false
        callback(output)
      }
      weekReportController.weekReportController(request, input, result => {
        callback(result)
      })

      // report time measure raw car data
    } else if (input.ReportTemplate_Time_Measure === 4) {
      if (input.ReportTemplate_DeviceIds.length > 1) {
        output.key = 'invalidRawCarStoreLength'
        output.status = false
        callback(output)
      }
      if (input.ReportTemplate_To_Date !== input.ReportTemplate_From_Date) {
        output.key = 'dateRangeInvalid'
        output.status = false
        callback(output)
      }
      storeController.getRawCarDataReport(input, result => {
        callback(result)
      })
    }
  } else {
    output.key = 'invalidDeviceId'
    output.status = false
    callback(output)
  }
}

const csvValidator = (request, callback) => {
  let output = {}
  const input = {
    email: request.email,
    subject: request.subject,
    attachment: request.attachment
  }
  const emailId = validate.isEmail(input.email)

  if (emailId) {
    storeController.generateCsv(input, result => {
      callback(result)
    })
  } else {
    output.key = 'invalidEmail'
    output.status = false
    callback(output)
  }
}

/**
 *
 * @param {*} request
 * @param {*} callback
 */
const getStores = (request, callback) => {
  storeController.getStores(request, result => {
    callback(result)
  })
}

const settingsDevices = (input, callback) => {
  if (!input.duid) {
      let output = {}
      output.key = 'requiredDuid';
      output.status = false
      callback(output)
  }
  if (input.duid) {
      callback()
  }
}

const settingsStores = (input, callback) => {
  if (!input.suid) {
      let output = {}
      output.key = 'requiredSuid';
      output.status = false
      callback(output)
  }
  if (input.duid) {
      callback()
  }
}

const getMasterSettings = (input, callback) => {
  if (!input.duid) {
      let output = {}
      output.key = 'requiredDuid';
      output.status = false
      callback(output)
  }
  if (input.duid) {
      callback()
  }
}

const saveMasterSettings = (input, callback) => {
  if (!input.duid) {
      let output = {}
      output.key = 'requiredDuid';
      output.status = false
      callback(output)
  }
  if (input.duid) {
      callback()
  }
}

const saveMergeDevices = (input, callback) => {
  if (!input.suid) {
      let output = {}
      output.key = 'requiredDuid';
      output.status = false
      callback(output)
  }
  if (input.duid) {
      callback()
  }
}
/**
 *
 * @param {*} request
 * @param {*} callback
 */
const getStoreByUid = (request, callback) => {
  let output = {}
  const suid = request.suid

  if (suid) {
    storeController.getStoreByStoreUid(suid, result => {
      callback(result)
    })
  } else {
    output.key = 'invalidInput'
    output.status = false
    callback(output)
  }
}


/**
 *
 * @param {*} request
 * @param {*} callback
 */
const removeDeviceById = (request, callback) => {
  let output = {}
  const duid = request.body.duid

  if (duid) {
    storeController.removeDeviceById(duid, result => {
      callback(result)
    })
  } else {
    output.key = 'invalidInput'
    output.status = false
    callback(output)
  }
}
module.exports = {
  reportValidator,
  csvValidator,
  settingsDevices,
  settingsStores,
  getMasterSettings,
  saveMasterSettings,
  saveMergeDevices,
  getStores,
  getStoreByUid,
  removeDeviceById
}
