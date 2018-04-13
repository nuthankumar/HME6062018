import * as moment from 'moment';
export const CommonConstants = {
  'apiUrls': {
    'getGroupHierarchyTree': 'api/group/getAll',
    'getSavedTemplates': 'api/reportTemplate/getAll',
    'generateReport': 'api/report/generatereport',
    'getSavedTemplateData': 'api/reportTemplate/get',
    'deleteTemplate': 'api/reportTemplate/delete',
    'createTemplate': 'api/reportTemplate/create',
    'getAvailableGroups': 'api/group/availabledetails',
    'editGroupDetails': 'api/group/editgroup',
    'addNewGroup': 'api/group/creategroup',
    'deleteGroup': 'api/group/deletegroup'
    },
  'TimeMeasureValidations': {
      'TwoMonths': 62,
      'Month' : 31,
      'TwoWeeks': 14,
      'Today':0 ,
  },
  'Drilldown': [2,4,1]
  }
