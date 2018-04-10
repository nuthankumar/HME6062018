const moment = require('moment')
exports.singleStore = {
  'storeName': 'store1',
  'storeDesc': 'store1 data ',
  'startTime': '',
  'stopTime': '',
  'printDate': moment().format('LL'),
  'printTime': moment().format('LT'),
  'currentPageNo': '1',
  'TotalPageCount': '1',
  'singleDayPart': [{
    'data': [{'daypart':
      {'timeSpan': '03/09 - Daypart1', 'currentDaypart': '6:00 am - 11:59 am'},
    'menu': {'color': 'rgb(4, 176, 0)', 'value': '0:29'},
    'greet': {'color': 'rgb(180, 0, 0)', 'value': '0:29'},
    'service': {'color': 'rgb(243, 190, 8)', 'value': '0:28'},
    'laneQueue': {'color': 'rgb(243, 190, 8)', 'value': '0:26'},
    'laneTotal': {'color': 'rgb(4, 176, 0)', 'value': '1.25'},
    'totalCars': '135'
    },
    {
      'daypart': {'timeSpan': '03/09 - Daypart2', 'currentDaypart': '12.00 pm - 2.53 am'},
      'menu': {'color': 'rgb(4, 176, 0)', 'value': '0:30'},
      'greet': {'color': 'rgb(180, 0, 0)', 'value': '0:30'},
      'service': {'color': 'rgb(180, 0, 0)', 'value': '0:30'},
      'laneQueue': {'color': 'rgb(243, 190, 8)', 'value': '0.31'},
      'laneTotal': {'color': 'rgb(243, 190, 8)', 'value': '1.31'},
      'totalCars': '285'
    }
    ]}
  ],
  'goalData': {
    'data':
   [
     {
       'title': '< Goal A',
       'menu': {'goal': '0:30', 'cars': '3083', 'percentage': '100%'},
       'greet': {'goal': '0:05', 'cars': '0', 'percentage': '0%'},
       'service': {'goal': '0:30', 'cars': '0', 'percentage': '0%'},
       'laneQueue': {'goal': '0:30', 'cars': '1491', 'percentage': '48%'},
       'laneTotal': {'goal': '1:30', 'cars': '3083', 'percentage': '100%'}
     },
     {
       'title': '< Goal B ',
       'menu': {'goal': '1.00', 'cars': '0', 'percentage': '100%'},
       'greet': {'goal': '0.10', 'cars': '3833', 'percentage': '100%'},
       'service': {'goal': '1.00', 'cars': '0', 'percentage': '0%'},
       'laneQueue': {'goal': '0:30', 'cars': '1491', 'percentage': '48%'},
       'laneTotal': {'goal': '1:30', 'cars': '3083', 'percentage': '100%'}
     },
     {
       'title': '<Goal C',
       'menu': {'goal': '1.00', 'cars': '0', 'percentage': '100%'},
       'greet': {'goal': '0.10', 'cars': '3833', 'percentage': '100%'},
       'service': {'goal': '2', 'cars': '0', 'percentage': '0%'},
       'laneQueue': {'goal': '4', 'cars': '1491', 'percentage': '48%'},
       'laneTotal': {'goal': '5', 'cars': '3083', 'percentage': '100%'}
     },
     {
       'title': '< Goal D',
       'menu': {'goal': '1.00', 'cars': '0', 'percentage': '100%'},
       'greet': {'goal': '1.82', 'cars': '3833', 'percentage': '100%'},
       'service': {'goal': '2', 'cars': '0', 'percentage': '0%'},
       'laneQueue': {'goal': '3', 'cars': '1491', 'percentage': '48%'},
       'laneTotal': {'goal': '7', 'cars': '3083', 'percentage': '100%'}
     },
     {
       'title': '> Goal D',
       'menu': {'goal': '1.00', 'cars': '0', 'percentage': '100%'},
       'greet': {'goal': '2.82', 'cars': '3800', 'percentage': '100%'},
       'service': {'goal': '2', 'cars': '0', 'percentage': '0%'},
       'laneQueue': {'goal': '3', 'cars': '1491', 'percentage': '48%'},
       'laneTotal': {'goal': '7', 'cars': '3083', 'percentage': '100%'}
     }
   ]
  },
  'LongestTimes': [
    {
      'Menu': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'Greet': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'Service': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'LaneQueue': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'LaneTotal': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      }
    },
    {
      'Menu': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'Greet': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'Service': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'LaneQueue': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'LaneTotal': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      }
    },
    {
      'Menu': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'Greet': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'Service': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'LaneQueue': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      },
      'LaneTotal': {
        'Value': 0.59,
        'Date': 'Mar 03/05',
        'Time': '07:53:22 PM'
      }
    }
  ],
  'displayData': {
    'Lane': '1',
    'AverageCarsInLane': '3',
    'TotalPullouts': '0',
    'TotalPullins': '0',
    'DeleteOverMaximum': '0',
    'PowerFails': '0',
    'SystemResets': '0',
    'VBDResets': '0'
  }
}
