const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration').db
const dataBaseSql = require('../DataBaseConnection/Configuration').sqlConfig
const sqlQuery = require('../Common/DataBaseQueries')

const sql = require('mssql')

/**
 *
 * @param {*} JSON input template for calling Procedure
 * @param {*} callback
 */
const getRawCarDataReport = (template, callback) => {
  repository.execute(sqlQuery.SummarizedReport.getRawData, {
    replacements: template,
    type: dataBase.QueryTypes.SELECT
  }, result => callback(result))
}

const getDayDataReport = (input, callback) => {
  const output = {}
  const sqlPool = new sql.ConnectionPool(dataBaseSql, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }

    sqlPool.request()
      .input('Device_IDs', sql.VarChar(500), input.ReportTemplate_DeviceIds.toString())
      .input('StoreStartDate', sql.Date, input.ReportTemplate_From_Date)
      .input('StoreEndDate', sql.Date, input.ReportTemplate_To_Date)
      .input('InputStartDateTime', sql.NVarChar(50), input.FromDateTime)
      .input('InputEndDateTime', sql.NVarChar(50), input.ToDateTime)
      // .input('CarDataRecordType_ID', sql.SmallInt, input.CarDataRecordType_ID)
      .input('ReportType', sql.Char, input.ReportTemplate_Type)
      .input('UserUID', sql.NVarChar(50), input.userUid)
      .execute('usp_HME_Cloud_Get_Report_By_Date_Details', (err, result) => {
        if (err) {
          output.data = err
          output.status = false
          callback(output)
        }
        if (result && result.recordsets) {
          output.data = result.recordsets
          output.status = true
          callback(output)
        }
      })
  })

  sqlPool.on('error', err => {
    if (err) {
      callback(err)
    }
  })
}
/**
 * The method can be used to execute get Report Template
 * @param  {template} template input from controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getWeekReport = (template, callback) => {
  const output = {}
  const sqlPool = new sql.ConnectionPool(dataBaseSql, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }
    sqlPool.request()
      .input('Device_IDs', sql.VarChar(500), template.Device_IDs)
      .input('StoreStartDate', sql.Date, template.StoreStartDate)
      .input('StoreEndDate', sql.Date, template.StoreEndDate)
      .input('InputStartDateTime', sql.NVarChar(50), template.StartDateTime)
      .input('InputEndDateTime', sql.NVarChar(50), template.EndDateTime)
      // .input('CarDataRecordType_ID', sql.SmallInt, template.CarDataRecordType_ID)
      .input('ReportType', sql.Char, template.ReportType)
      .input('LaneConfig_ID', sql.TinyInt, template.LaneConfig_ID)
      .input('UserUID', sql.NVarChar(50), template.UserUID)
      .execute('usp_HME_Cloud_Get_Report_By_Week_Details', (err, result) => {
        if (err) {
          output.data = err
          output.status = false
          console.log(err)
          callback(output)
        }
        if (result && result.recordsets) {
          //  console.log("result.recordsets",result.recordsets)
          output.data = result.recordsets
          output.status = true
          callback(output)
        }
      })
  })

  sqlPool.on('error', err => {
    if (err) {
      callback(err)
    }
  })
}

const getStores = (input, callback) => {
  const output = {}
  const sqlPool = new sql.ConnectionPool(dataBaseSql, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }
    console.log(input)
    sqlPool.request()
      .input('User_UID', sql.VarChar(32), input.userUid)
      .input('SortingColumnName', sql.VarChar(32), input.query.sort)
      .input('IsAdmin', sql.VarChar(32), input.query.isAdmin) // number

      // TO DO : Need to decide on number of parameters

    // .input('Brand_Name', sql.VarChar(32), input.query.)
    // .input('Store_Number', sql.VarChar(32), input.query.Store_Number)
    // .input('Store_Name', sql.VarChar(32), input.query.Store_Name)
    // .input('Device_SerialNumber', sql.VarChar(32), input.query.Device_SerialNumber)
    // .input('Company_Name', sql.VarChar(32), input.query.Company_Name)
    // .input('Device_MainVersion', sql.VarChar(32), input.query.Device_MainVersion)
    // .input('Store_AddressLine1', sql.VarChar(32), input.query.Store_AddressLine1)
    //  search add this varible

      .input('RecordPerPage', sql.SmallInt, input.query.per)
      .input('PageNumber', sql.SmallInt, input.query.pno)
      .execute('usp_getUserStoreList1', (err, result) => {
        if (err) {
          output.data = err
          output.status = false
          callback(output)
        }
        if (result && result.recordsets) {
          output.data = result.recordsets
          output.status = true
          callback(output)
        }
      })
  })

  sqlPool.on('error', err => {
    if (err) {
      callback(err)
    }
  })
}

/**
 *
 * @param {*} input
 * @param {*} callback
 */
const getStoreByUid = (input, callback) => {
  const output = {}
  const sqlPool = new sql.ConnectionPool(dataBaseSql, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }
    console.log(input)
    sqlPool.request()
      .input('store_UID', sql.VarChar(32), input.suid)
      .execute('usp_getStoreByStoreUid', (err, result) => {
        if (err) {
          output.data = err
          output.status = false
          callback(output)
        }
        if (result && result.recordsets) {
          output.data = result.recordsets
          output.status = true
          callback(output)
        }
      })
  })

  sqlPool.on('error', err => {
    if (err) {
      callback(err)
    }
  })
}

/**
 *
 * @param {*} input
 * @param {*} callback
 */
const removeDeviceById = (input, callback) => {
  const output = {}
  const sqlPool = new sql.ConnectionPool(dataBaseSql, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }
    console.log(input)
    sqlPool.request()
      .input('device_UID', sql.VarChar(32), input.duid)
      .execute('usp_removeDeviceFromStore', (err, result) => {
        if (err) {
          output.data = err
          output.status = false
          callback(output)
        }
        if (result && result.recordsets) {
          output.data = result.recordsets
          output.status = true
          callback(output)
        }
      })
  })

  sqlPool.on('error', err => {
    if (err) {
      callback(err)
    }
  })
}

const settingsDevices = (input, callback) => {
  repository.executeProcedure(sqlQuery.DeviceStatus.getStatus, request => {
    return request
      .input(sqlQuery.DeviceIds.Parameters.Device_IDs, sql.VarChar(36), input.duid)
  }, callback);
}

// Todo: SettingStores Store Procedure
const settingsStores = (input, callback) => {
  repository.executeProcedure(sqlQuery.DeviceStatus.getStatus, request => {
    return request
      .input(sqlQuery.DeviceIds.Parameters.Device_IDs, sql.VarChar(36), input.duid)
  }, callback);
}

module.exports = {
  getRawCarDataReport,
  getDayDataReport,
  getWeekReport,
  settingsDevices,
  settingsStores,
  getStores,
  getStoreByUid,
  removeDeviceById
}
