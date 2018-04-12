const sql = require('mssql')

module.exports = {
    tenant: 'nousinfo.onmicrosoft.com', //'hme.com',
    authorityHostUrl: 'https://login.microsoftonline.com',
    clientId: 'bb902204-5228-4e3c-8d79-d4e0bd722bc9', //'2cf32590-06c1-451c-9c93-be26376027f5' 
    resource: '00000002-0000-0000-c000-000000000000',
    domain: 'nousinfo.com',
    secret: 'hme-client-secret',
    sqlConfig: {
        user: 'sa',
        password: 'nous@123',
        server: 'NIBC1329',
        database: 'hmeCloud',
        options: {
            encrypt: true // Use this if you're on Windows Azure
        }
    }
}