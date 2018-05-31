export const CommonConstants = {
  'apiUrls': {
    'getGroupHierarchyTree': 'api/group/getAll',
    'getSavedTemplates': 'api/reportTemplate/getAll',
    'generateReport': 'api/report/generatereport',
    'generateNewReport': 'api/newReports/generatereport',
    'getSavedTemplateData': 'api/reportTemplate/get',
    'deleteTemplate': 'api/reportTemplate/delete',
    'createTemplate': 'api/reportTemplate/create',
    'getAvailableGroups': 'api/group/availabledetails',
    'editGroupDetails': 'api/group/editgroup',
    'addNewGroup': 'api/group/creategroup',
    'deleteGroup': 'api/group/deletegroup',
    'auth': 'api/auth/login',
    'getUserRoles': 'api/role/getAll',
    'createUser': 'api/user/create',
    'getUser': 'api/user/get', 
    'deleteUser': 'api/user/delete',
    'getAudit': 'api/user/getAudit',
    'getStores': 'api/store/getAllStores',
    'getSettingsDevices': 'api/store/settingsDevices',
    'getUnregisteredDevices': 'api/device/getAllUnregisterdDevices',
    'getMasterSettings': 'api/store/getMasterSettings'
  },
  'TimeMeasureValidations': {
    'TwoMonths': 62,
    'Month': 31,
    'TwoWeeks': 14,
    'Today': 0,
    'ThreeMonths': 93
  },
  'TimeMeasure': {
    'Day': 1,
    'Daypart': 2,
    'Week': 3,
    'RawCarData': 4
  },
  'Type': {
    'Group': 'group',
    'Store': 'store'
  },
  'Drilldown': [2, 4, 1]
}
