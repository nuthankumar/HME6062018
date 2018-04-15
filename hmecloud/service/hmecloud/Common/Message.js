/**
 * Common error messages
 */

//     Group Hierarchy

exports.LISTGROUP = {
  createdBy: 'createdBy number is  required',
  accountId: 'accountId number is  required',
  notfound: 'No Records found'
}

exports.CREATEGROUP = {
  groupNameEmpty: 'Group name can not be empty',
  groupSuccess1: 'Group ',
  groupSuccess2: ' has been created successfully',
  groupId: 'Invalid groupId',
  invalidInput: 'Invalid input details has provided',
  groupAlreadyExist: ' already exist in the user account',
  groupUpdatesSuccess: ' has been updated successfully',
  noRecordsFound: 'No records found for deleting',
  RecordsDeleted: ' Records deleted Successfully',
  RecordDeleted: ' Record deleted Successfully',
  noDataForGivenId: 'No data found for the given Id: ',
  invalidRequestBody: 'Invalid request body',
  groupIdNo: 'GroupId: ',
  groupCreationFailed: ' Creation failed',
  noDataForGivenName: 'No data found for the given name: ',
  groupUpdationFailed: ' Updation failed'
}

exports.REPORTSUMMARY = {
  invalidTemplateId: 'Invalid templateId',
  saveTempplateSuccess: 'Template has been saved successfully',
  failedSaveTemplate: 'Failed to Save template',
  invalidTemplateName: 'Invalid template Name',
  DeletedSaveTemplate: 'Saved Template has been deleted successfully',
  InvalidStoreId: 'Please select a valid Store',
  DateCannotbeEmpty: 'Please select a date',
  DateRangeInvalid: 'Date range invalid. For Raw Data Reports select a single day.',
  InvalidReportType: 'Invalid Report Type param',
  createSuccess: 'Report Template create successfully',
  createFail: 'Unable to Create Report',
  deleteSuccess: 'Report Template Deleted successfully',
  deteleFail: 'Unable to Delete Report'
}

exports.EventName = {
  MENU: 'Menu Board',
  LANEQUEUE: 'Lane Queue',
  LANETOTAl: 'Lane Total',
  SERVICE: 'Service',
  GREET: 'Greet'
}

exports.Events = {
  MENU: 'Menu',
  LANEQUEUE: 'Queue',
  LANETOTAl: 'Lane',
  SERVICE: 'Service',
  GREET: 'Greet',
  CASHIER: 'Cashier'
}

exports.TimeFormat = {
  Seconds: 1,
    MINUTES: 2,
    2: 'Minutes',
    1: 'Seconds',
    Minutes : 2
    
}
exports.COMMON = {
    CSVTYPE: 'CSV',
    DAYPARTOPENTIME: ' OPEN-11:59',
    DAYPARTCLOSETIME: ' CLOSE-23:59',
    DAYOPENCLOSE: 'OPEN-CLOSE',
    WAVG: 'W-Avg',
    OPENVALUE: ' OPEN',
    CLOSEVALUE: ' CLOSE'
}

exports.JWT = {
  TOKENMISS: 'No token provided',
  JWTFAIL: 'Failed to authenticate token'
}

exports.TimeMeasure = {
    Day: 1,
    1 : 'Day'
}

exports.Type = {
    Cumulative: 2,
    'Time Slice': 1,
    2: 'Cumulative',
    1: 'Time Slice'
}
