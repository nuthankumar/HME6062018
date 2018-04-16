
const messages = require('../Common/Message')
const repository = require('../Repository/ReportTemplateRepository')
const dateUtils = require('../Common/DateUtils')
const uuidv4 = require('uuid/v4');

/**
 * The method can be used to execute handel errors and return to routers.
 * @param  {input} message input from custom messages.
 * @param  {input} status input false.
 * @public
 */
const errorHandler = (message, status, request) => {
  let output = {}
  output.error = request.t(message)
  output.status = status
  return output
}

/**
 * The method can be used to execute create Report Template
 * @param  {input} reportTemplate input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const create = (reportTemplate, callback) => {
    let output = {}
  const values = {
    Stores: reportTemplate.body.selectedStoreIds.toString(),
    Uid: uuidv4(), 
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
    SessionUid: uuidv4(),  // To be updated with actual
    UserUid: reportTemplate.userId,
    CreatedBy: reportTemplate.UserEmail,
      AdvancedOption: (reportTemplate.body.advancedOption === true ? 1 : 0),
      LongestTime: (reportTemplate.body.longestTime === true ? 1 : 0),
    CreatedDateTime: reportTemplate.body.createdDateTime
    }

    console.log("The final input", values)
  repository.create(values, (result) => {
    if (result) {
      output.data = reportTemplate.t('REPORTSUMMARY.createSuccess')
      output.status = true
      callback(output)
    } else {
      output.error = reportTemplate.t('REPORTSUMMARY.createFail')
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
         reportTemplate.fromDate = dateUtils.convertYYYYMMDD(reportTemplate.fromDate)
         reportTemplate.toDate = dateUtils.convertYYYYMMDD(reportTemplate.toDate)
            reportTemplate.openTime = dateUtils.converthhmmtt(reportTemplate.openTime)
            reportTemplate.closeTime = dateUtils.converthhmmtt(reportTemplate.closeTime)
         reportTemplate.timeMeasure = messages.TimeMeasure[reportTemplate.timeMeasure]
         reportTemplate.type = messages.Type[reportTemplate.type]
         reportTemplate.format = messages.TimeFormat[reportTemplate.format]
         reportTemplate.selectedStoreIds = reportTemplate.devices.split(',')
         reportTemplate.advancedOption = (reportTemplate.advancedOption === 1 ? true : false)
         reportTemplate.longestTime = (reportTemplate.longestTime === 1 ? true : false)
         reportTemplate.systemStatistics = (reportTemplate.systemStatistics === 1 ? true : false)
         reportTemplate.close = (reportTemplate.close === 1 ? true : false)
         reportTemplate.open= (reportTemplate.open === 1 ? true : false)

         output.data = reportTemplate
         output.status = true
         callback(output)
    } else {
      output.error = request.t('LISTGROUP.notfound')
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
        console.log("The result==", JSON.stringify(result))
    if (result.length > 0) {
      output.data = result
      output.status = true
      callback(output)
    } else {
      output.error = request.t('LISTGROUP.notfound')
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
      output.data = input.t('REPORTSUMMARY.deleteSuccess')
      output.status = true
      callback(output)
    } else {
      output.error = input.t('LISTGROUP.notfound')
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
