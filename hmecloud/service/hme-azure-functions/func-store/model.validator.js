const Joi = require('joi');

const schema = {
    reportTemplateStoreId: Joi.number().integer().required(),
    reportTemplateAdvancedOp: Joi.string(),
    reportTemplateTimeMeasure: Joi.string(),
    reportTemplateFromDate: Joi.string().required(),
    reportTemplateToDate: Joi.string().required(),
    reportTemplateFromTime: Joi.string(),
    reportTemplateToTime: Joi.string(),
    reportTemplateOpen: Joi.string(),
    reportTemplateClose: Joi.string(),
    reportTemplateType: Joi.string(),
    reportTemplateIncludeLongs: Joi.string(),
    reportTemplateFormat: Joi.string()
};

var validateTemplate = function(data, config) {
    config = config || {};
    const result = Joi.validate(data, schema, config);
    // console.log('validation-result: ', result);
    return result.error === null; // to-do: return messages[]
};

exports.isValidTemplate = validateTemplate;