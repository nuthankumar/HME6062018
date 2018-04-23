
const messages = require('../Common/Message')
const repository = require('../Repository/ReportTemplateRepository')
const dateUtils = require('../Common/DateUtils')
const uuidv4 = require('uuid/v4')

/**
 * The method can be used to execute create Report Template
 * @param  {input} reportTemplate input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const create = (reportTemplate, callback) => {
  let output = {}
  const values = {
    DeviceUUIds: reportTemplate.body.deviceUUIds.toString(),
    Uid: uuidv4().toUpperCase(),
    TimeMeasure: messages.TimeMeasure[reportTemplate.body.timeMeasure],
    FromDate: reportTemplate.body.fromDate,
    ToDate: reportTemplate.body.toDate,
    OpenTime: reportTemplate.body.openTime,
    CloseTime: reportTemplate.body.closeTime,
    Type: messages.Type[reportTemplate.body.type],
    Open: (reportTemplate.body.open === true ? 1 : 0),
    Close: (reportTemplate.body.close === true ? 1 : 0),
    SystemStatistics: (reportTemplate.body.systemStatistics === true ? 1 : 0),
    Format: messages.TimeFormat[reportTemplate.body.format],
    TemplateName: reportTemplate.body.templateName,
    // Session Id is reading dtbl_User_Session table in
    // the Procedure while creating template
    SessionUid: ' ',
    UserUid: reportTemplate.userUid,
    CreatedBy: reportTemplate.UserEmail,
    AdvancedOption: (reportTemplate.body.advancedOption === true ? 1 : 0),
    LongestTime: (reportTemplate.body.longestTime === true ? 1 : 0),
    CreatedDateTime: reportTemplate.body.createdDateTime
  }
  repository.create(values, (result) => {
    if (result.length > 0) {
      let isTemplateCreated = result[0]
      if (isTemplateCreated.IsRecordInserted === 1) {
        output.key = 'pleaseenterauniquetemplate'
        output.status = true
      } else if (isTemplateCreated.IsRecordInserted > 1) {
        output.key = 'reportTemplatecreateSuccess'
        output.status = true
      }
      callback(output)
    } else {
      output.key = 'reportTemplatecreateFailure'
      output.status = false
      callback(output)
    }
  })
}

/**
 * The method can be used to execute get Report Template
 * @param  {input} reportTemplate input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const get = (reportTemplate, request, callback) => {
  let output = {}
  repository.get(reportTemplate, (result) => {
    if (result) {
      let reportTemplate = result
      reportTemplate.FromDate = dateUtils.convertYYYYMMDD(reportTemplate.FromDate)
      reportTemplate.ToDate = dateUtils.convertYYYYMMDD(reportTemplate.ToDate)
      reportTemplate.OpenTime = dateUtils.converthhmmtt(reportTemplate.OpenTime)
      reportTemplate.CloseTime = dateUtils.converthhmmtt(reportTemplate.CloseTime)
      reportTemplate.TimeMeasure = messages.TimeMeasure[reportTemplate.TimeMeasure]
      reportTemplate.Type = messages.Type[reportTemplate.Type]
      reportTemplate.Format = messages.TimeFormat[reportTemplate.Format]
      reportTemplate.DeviceUUIds = reportTemplate.Devices.split(',')
      reportTemplate.AdvancedOption = (reportTemplate.AdvancedOption === 1)
      reportTemplate.LongestTime = (reportTemplate.LongestTime === 1)
      reportTemplate.SystemStatistics = (reportTemplate.SystemStatistics === 1)
      reportTemplate.Close = (reportTemplate.Close === 1)
      reportTemplate.Open = (reportTemplate.Open === 1)

      output.data = reportTemplate
      output.status = true
      callback(output)
    } else {
      output.key = 'noDataFound'
      output.status = false
      callback(output)
    }
  })
}

/**
 * The method can be used to execute getAll Report Templates
 * @param  {input} AccountId input from  user request
 * @param  {input} CreatedBy input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (input, request, callback) => {
  let output = {}
  repository.getAll(input.UserUid, (result) => {
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
/**
 * The method can be used to execute delete the report template
 * @param  {input} input input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const deleteById = (input, callback) => {
  let output = {}
  repository.deleteById(input.query.templateId, (result) => {
    if (result) {
      output.key = 'reportTemplatedeleteSuccess'
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
  create,
  deleteById,
  get,
  getAll
}
