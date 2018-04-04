const csvFile = require('../../common/csvUtils')
var jsonexport = require('jsonexport')
const db = require('../../Model/DataBaseConnection/configDb')
const mail = require('../../common/emailUtil')
const dateUtils = require('../../common/DateUtils')
const HashMap = require('hashmap')
const dateFormat = require('dateformat');

const generateSummaryReport = (input, callback) => {
  console.log('Enter generateSummaryReport')
  console.log('input.stores')
  console.log(input.stores.toString())


  const Query =
    "exec [dbo].generateSumamrizereport  @storeIds=' " + input.stores.toString() + "';"
  db
    .query(Query, {
      type: db.QueryTypes.RAW
    })
    .spread(result => {
      if (result) {
        console.log(result)

        const output = {
          data: result,
          status: true
        }
        callback(output)
      }
    })
    .catch(error => {
      console.log(error)
      const output = {
        data: error,
        status: true
      }

      callback(output)
    })
}

const timeMeasure = (callback) => {
  const Query =
    'select Id,Type from [dbo].[TimeMeasure] '
  db
    .query(Query, {
      type: db.QueryTypes.RAW
    })
    .spread(result => {
      if (result) {
        const output = {
          data: result,
          status: true
        }
        callback(output)
      }
    })
    .catch(error => {
      console.log(error)
      const output = {
        data: error,
        status: true
      }

      callback(output)
    })
}

const generateCSV = (input, callback) => {
  const csv = csvFile.DAYREPORT
  jsonexport(csv, function (err, csv) {

console.log("CSV",csv)
    const loggedInUser = 'jaffersr@nousinfo.com'
    var attachment = [{
      // file on disk as an attachment
      filename: 'package.csv',
      content: csv,
      encoding: 'utf16le'
    }]


    mail.send(loggedInUser, attachment, isMailSent => {
      if (isMailSent) {
        callback('success')
      } else {
        callback('failure')
      }
    })
  });
}

const getRawCarDataReport = (input, callback) => {
    const rawCarDataList = [];
    const output = {}
    const rawCarData = {};
    const departTimeStampMap = new HashMap();
    const Query =
        "exec usp_HME_Cloud_Get_Report_Raw_Data_Details " + input.ReportTemplate_StoreId + " ,'" + input.ReportTemplate_From_Date + "', '" + input.ReportTemplate_To_Date + "',NULL, NULL,'" + input.ReportTemplate_Type+"'";

    db.query(Query, {
        type: db.QueryTypes.SELECT
    }).then(result => {
        const len = result.length;
        const storeData = result[len - 2];
        const dayPartData = result[len - 1];
        rawCarData.store = storeData.Store_Name,
            rawCarData.description = storeData.Brand_Name,
            rawCarData.startTime = input.ReportTemplate_From_Date,
            rawCarData.stopTime = input.ReportTemplate_To_Date
            rawCarData.printDate = dateFormat(new Date(), "isoDate")
            rawCarData.printTime = dateFormat(new Date(), "shortTime")
            result.forEach(item => {
            let rawCarTempId = item.RawDataID;
                if (rawCarTempId && !departTimeStampMap.has(rawCarTempId)) {
                let departTimeStampList = result.filter(function (obj) {
                    return obj.RawDataID == rawCarTempId;
                });
            let tempRawCarData = departTimeStampList[0];
            const rawCarDataObj = {};
            rawCarDataObj.departureTime = tempRawCarData.DepartTimeStamp,
                rawCarDataObj.eventName = tempRawCarData.CarRecordDataType_Name,
                    rawCarDataObj.carsInQueue = tempRawCarData.CarsInQueue
                rawCarData.dayPart = "DP" + tempRawCarData.Daypart_ID + dateUtils.dayPartTime(tempRawCarData.Daypart_ID, len, dayPartData.StartTime, dayPartData.EndTime)

            for (let i = 0; i < departTimeStampList.length; i++) {
                let tempEventDetails = departTimeStampList[i];
                if (tempEventDetails.EventType_Name.includes("Menu Board")) {
                    rawCarDataObj.menu = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                } else if (tempEventDetails.EventType_Name.includes("Lane Queue")) {
                    rawCarDataObj.laneQueue = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                } else if (tempEventDetails.EventType_Name.includes("Lane Total")) {
                    rawCarDataObj.laneTotal = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                } else if (tempEventDetails.EventType_Name.includes("Service")) {
                    rawCarDataObj.service = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                } else if (tempEventDetails.EventType_Name.includes("Greet")) {
                    rawCarDataObj.greet = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                }

            }
            rawCarDataList.push(rawCarDataObj);
            departTimeStampMap.set(rawCarTempId, rawCarTempId);
        }
        });
        rawCarData.rawCarData = rawCarDataList;

        output.data = rawCarData
        output.status = true
        callback(output)

    }).catch(error => {
        const output = {
            data: error,
            status: false
        }
        callback(output)
    });
}

module.exports = {
  generateSummaryReport,
  timeMeasure,
    generateCSV,
    getRawCarDataReport
}