const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const moment = require('moment')
const repository = require('../Repository/StoresRepository')

const generateWeekReport = (input, callback) => {
  const days = dateUtils.dateDifference(input.ReportTemplate_From_Date, input.ReportTemplate_To_Date)
  const months = dateUtils.dateDifference(input.ReportTemplate_From_Date, input.ReportTemplate_To_Date)
  const storeLength = (input.ReportTemplate_StoreIds).length
  console.log('Length', storeLength)
  console.log('months', months)
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
  repository.getWeekReport(inputDate, (result) => {
    // callback(result)
    if (result.length > 0) {
      let reportData = {
        data: {
          singleWeek: []
        }
      }
      const repositoryData = result
      reportData.data.timeMeasure = 3
      reportData.data.selectedStoreIds = input.ReportTemplate_StoreIds
      reportData.data.startTime = moment(fromDateTime).format('LL')
      reportData.data.stopTime = moment(toDateTime).format('LL')
      reportData.status = true
      let colors = _.filter(repositoryData, val => val.ColourCode)
      console.log('colors', colors)
      let goalSettings = _.filter(repositoryData, group => group['Menu Board - GoalA'])
      console.log('goalSettings', goalSettings)
      const StoreData = storeDetails(repositoryData, colors, goalSettings)
      const goalsData = goalData(repositoryData)
      reportData.data.singleWeek = StoreData

      callback(StoreData)
    } else {
      let output = {}
      output.error = 'no data'
      output.status = false
      callback(output)
    }
  })
}

const storeDetails = (repositoryData, colors, goalSettings) => {
  let storeDetails = _.filter(repositoryData, (value) => {
    if (value.StoreNo) {
      return value
    }
  })
  let colorSettings = []
  if (colors.length > 0) {
    colorSettings = colors[0].ColourCode.split('|')
  }
  let getColor = (event, eventValue) => {
    let color = colorSettings[2]
    const eventSettings = _.pickBy(goalSettings[0], (value, key) => {
      if (key.toLowerCase().includes(event.toLowerCase())) {
        if (value && eventValue < value) {
          if (key.includes('GoalA')) {
            color = colorSettings[0]
          } else if (key.includes('GoalB')) {
            color = colorSettings[1]
          } else if (key.includes('GoalC')) {
            color = colorSettings[2]
          }
          return true
        }
      }
    })
    console.log('VALUS>>>>', eventSettings)
    console.log('event>>>>', event)
    console.log('vale>>>>', eventValue)
    return color
  }
  let storesData = []
  _.forEach(storeDetails, (items) => {
    let Week = {
      'week': {'open': items.WeekStartDate, 'close': items.WeekEndDate},
      'menu': {'value': items['Menu Board'], 'color': getColor('Menu', items['Menu Board'])},
      'greet': {'value': items.Greet, 'color': getColor('Greet', items.Greet)},
      'service': {'value': items.Service, 'color': getColor('Service', items.Service)},
      'laneQueue': {'value': items['Lane Queue'], 'color': getColor('Lane Queue', items['Lane Queue'])},
      'laneTotal': {'value': items['Lane Total'], 'color': getColor('Lane Total', items['Lane Total'])},
      'totalCars': {'value': items['Total_Car'], 'color': getColor('Total_Car', items['Total_Car'])}
    }
    return storesData.push(Week)
  })

  return storesData
}
const goalData = (repositoryData) => {
  let goals = []
  goals = _.filter(repositoryData, (value) => {
    console.log()
    if (value.headerName) {
      return value
    }
  })
  return goals
}

module.exports = {
  generateWeekReport
}
