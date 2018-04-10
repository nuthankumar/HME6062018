const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const moment = require('moment')
const repository = require('../Repository/StoresRepository')

const generateWeekReport = (input, callback) => {
  let reportData = {
    data: {
      singleWeek: []
    }
  }
  const days = dateUtils.dateDifference(input.ReportTemplate_From_Date, input.ReportTemplate_To_Date)
  const storeLength = (input.ReportTemplate_StoreIds).length
  console.log('Length', storeLength)
  if (days > -1) {
    console.log('DATA validation')
  } else {
    console.log('DATA ERROR') // Callback and throw the error
  }
  let fromDateTime = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  let toDateTime = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)
  const inputDate = {
    Device_IDs: (input.ReportTemplate_StoreIds).toString(),
    StoreStartDate: input.ReportTemplate_From_Date,
    StoreEndDate: input.ReportTemplate_To_Date,
    StartDateTime: fromDateTime,
    EndDateTime: toDateTime,
    CarDataRecordType_ID: input.CarDataRecordType_ID,
    ReportType: input.ReportTemplate_Type,
    LaneConfig_ID: 1
  }
  console.log('DATA Coming', inputDate)
  repository.getWeekReport(inputDate, (result) => {
    // callback(result)
    if (result.length > 0) {
      reportData.data.timeMeasure = 3
      reportData.data.selectedStoreIds = input.ReportTemplate_StoreIds
      reportData.data.startTime = moment(fromDateTime).format('LL')
      reportData.data.stopTime = moment(toDateTime).format('LL')
      reportData.status = true
      let storeDetails = []
      storeDetails = _.filter(result, (value) => {
        if (value.StoreNo) {
          return value
        }
      })
      let storesData = []
      _.forEach(storeDetails, (items) => {
        let Week = {
          'week': {'open': items.WeekStartDate, 'close': items.WeekEndDate},
          'menu': {'value': items['Menu Board'], 'color': '#EEEEE'},
          'greet': {'value': items.Greet, 'color': '#EEEEE'},
          'service': {'value': items.Service, 'color': '#EEEEE'},
          'laneQueue': {'value': items['Lane Queue'], 'color': '#EEEEE'},
          'laneTotal': {'value': items['Lane Total'], 'color': '#EEEEE'},
          'totalCars': {'value': items['Total_Car'], 'color': '#EEEEE'}
        }
        return storesData.push(Week)
      })
      reportData.data.singleWeek = storesData
      // let goals = []
      // goals = _.filter(result, (value) => {
      //   if (value.headerName) {
      //     return value
      //   }
      // })
      // let goalData = []
      // _.forEach(goals, (items) => {
      //   let goals = {
      //     'week': {'open': items.WeekStartDate, 'close': items.WeekEndDate},
      //     'menu': {'value': items['Menu Board'], 'color': '#EEEEE'},
      //     'greet': {'value': items.Greet, 'color': '#EEEEE'},
      //     'service': {'value': items.Service, 'color': '#EEEEE'},
      //     'laneQueue': {'value': items['Lane Queue'], 'color': '#EEEEE'},
      //     'laneTotal': {'value': items['Lane Total'], 'color': '#EEEEE'},
      //     'totalCars': {'value': items['Total_Car'], 'color': '#EEEEE'}
      //   }
      //   return storesData.push(Week)
      // })
      // console.log('GOALS', goalData)
      callback(result)
    }
  })
}
module.exports = {
  generateWeekReport
}
