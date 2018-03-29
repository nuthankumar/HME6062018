const createHandler = require('azure-function-express').createHandler;
const express = require('express');
const group = require('./controller/groupController/groupHierarchy');
const i18n = require("i18n");

i18n.configure({
    locales: ['en', 'de'],
    directory: __dirname + '/locales'
});

// Router config

const groupHierarchy = require('./Router/groupRouter/groupHierarchy')




const app = express();


/**
 * start  Group hierarchy - Routing files
 */
app.use('/api/group',groupHierarchy)

/**
 * end
 */




// Binds the express app to an Azure Function handler
module.exports = createHandler(app);