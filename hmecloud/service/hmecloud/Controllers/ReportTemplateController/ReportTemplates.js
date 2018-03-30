/**
 * Sample CURD application in report templets Page in summary report
 */

const reportTemplates = require("../../Model/templates/reportTemplate");
// Config messages
const messages = require("../../common/message");
const db = require("../../Model/DataBaseConnection/configDb");

// List all templates

const getReportTemplates = (input, callback) => {
  const Query =
    "select distinct Id, TemplateName from ReportTemplates where AccountId=" +
    input.AccountId +
    " and CreatedBy=" +
    input.CreatedBy;
  db
    .query(Query, {
      type: db.QueryTypes.SELECT
    })
    .then(result => {
      console.log("The raw data===****" + JSON.stringify(result));
      const output = {};
      if (result) {
        output.data = result;
        output.status = true;
      } else {
        output.data = "notfound";
        output.status = false;
      }
      callback(output);
    })
    .catch(error => {
      const output = {
        data: error,
        status: false
      };
      callback(output);
    });
};

const createReportTemplate = (input, callback) => {
  reportTemplates
    .create(input)
    .then(result => {
      const output = {};
      if (result) {
        output.data = messages.REPORTSUMMARY.saveTempplateSuccess;
        output.status = true
      } else {
        output.data = messages.REPORTSUMMARY.failedSaveTemplate;
        output.status = false
      }

      callback(output)
    })
    .catch(error => {
      const output = {
        data: error,
        status: false
      };
      callback(output);
    });
};

const deleteReportTemplate = (input, callback) => {
  const condition = {
    where: {
      AccountId: input.AccountId,
      Id: input.Id
    }
  };
  reportTemplates
    .destroy(condition)
    .then(result => {
      const output = {};
      if (result) {
        output.data = messages.REPORTSUMMARY.DeletedSaveTemplate;
        output.status = true;
      } else {
        output.data = "notfound";
        output.status = false;
      }

      callback(output);
    })
    .catch(error => {
      const output = {
        data: error,
        status: false
      };
      callback(output);
    });
};

const getReportTemplate = (input, callback) => {
  const output = {};
  const condition = {
    where: {
      AccountId: input.AccountId,
      Id: input.Id
    }
  };
  reportTemplates
    .findOne(condition)
    .then(result => {
      if (result) {
        output.data = result;
        output.status = true;
      } else {
        output.data = "notfound";
        output.status = false;
      }
      callback(output);
    })
    .catch(error => {
      output.data = error;
    });
};

module.exports = {
  createReportTemplate,
  deleteReportTemplate,
  getReportTemplate,
  getReportTemplates
};
