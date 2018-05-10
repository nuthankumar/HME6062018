const dateUtils = require('../Common/DateUtils')
const reports = function (request, reportName) {
  this.request = request
  this.reportName = reportName
}
reports.prototype.noOfPages = function () {
  let pageStartDate = this.request.body.fromDate
  let pageEndDate = this.request.body.toDate
  let currentPage = this.request.body.pageNumber
  let lastPage
  if (this.reportName === 'day') {
    if (currentPage === 0) {
      pageStartDate = this.request.body.fromDate
      pageEndDate = this.request.body.toDate
      lastPage = 0
    } else if (this.request.body.deviceIds.length > 1) {
      let daysDiff = dateUtils.dateDifference(this.request.body.fromDate, this.request.body.toDate)
      lastPage = Math.ceil((daysDiff + 1) / 2)
      if (currentPage !== 1) {
        pageStartDate = dateUtils.getAdvancedSelectionMaxDate(((currentPage - 1) * 2), pageStartDate)
      }
      pageEndDate = dateUtils.getAdvancedSelectionMaxDate(1, pageStartDate)
      if (pageEndDate > this.request.body.toDate) {
        pageEndDate = pageStartDate
      }
    } else {
      let daysDiff = dateUtils.dateDifference(this.request.body.fromDate, this.request.body.toDate)

      lastPage = Math.ceil((daysDiff + 1) / 7)
      if (currentPage !== 1) {
        pageStartDate = dateUtils.getAdvancedSelectionMaxDate(((currentPage - 1) * 7), pageStartDate)
      }
      pageEndDate = dateUtils.getAdvancedSelectionMaxDate(6, pageStartDate)
      if (pageEndDate > this.request.body.toDate) {
        pageEndDate = this.request.body.toDate
      }
    }
    this.request.body.fromDate = pageStartDate
    this.request.body.toDate = pageEndDate
    let totalRecordCount = {}
    totalRecordCount.NoOfPages = lastPage
    return totalRecordCount
  } else if (this.reportName === 'week') {
    if (currentPage === 0) {
      lastPage = 0
      pageStartDate = this.request.body.fromDate
      pageEndDate = this.request.body.toDate
    } else if (this.request.body.deviceIds.length > 1) {
      let daysDiff = dateUtils.dateDifference(this.request.body.fromDate, this.request.body.toDate)
      lastPage = Math.ceil((daysDiff + 1) / 14)
      if (currentPage !== 1) {
        pageStartDate = dateUtils.getAdvancedSelectionMaxDate(((currentPage - 1) * 14), pageStartDate)
      }
      pageEndDate = dateUtils.getAdvancedSelectionMaxDate(13, pageStartDate)
      if (pageEndDate > this.request.body.toDate) {
        pageEndDate = dateUtils.getAdvancedSelectionMaxDate(6, pageStartDate)
      }
    } else {
      let daysDiff = dateUtils.dateDifferenceMonths(this.request.body.fromDate, this.request.body.toDate)
      lastPage = Math.ceil((daysDiff + 1))
      if (currentPage !== 1) {
        pageStartDate = dateUtils.getAdvancedSelectionMaxDate(((currentPage - 1) * 31), pageStartDate)
      }
      pageEndDate = dateUtils.getAdvancedSelectionMaxDate(27, pageStartDate)
      if (pageEndDate > this.request.body.toDate) {
        pageEndDate = this.request.body.toDate
      }
    }
    this.request.body.fromDate = pageStartDate
    this.request.body.toDate = pageEndDate
    let totalRecordCount = {}
    totalRecordCount.NoOfPages = lastPage
    return totalRecordCount
  }
}

module.exports = reports
