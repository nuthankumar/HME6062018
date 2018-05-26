import * as storeDetails from '../actionTypes/StoreDetails/storeDetails'
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'
// import AuthenticationService from '../components/Security/AuthenticationService'

function getNotesSuccess (stores) {
  return {
    type: storeDetails.INIT_STORESDETAILS,
    storeDetails: stores
  }
}
export const initStoresDetails = () => {
  this.api = new Api()
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=0'
  return (dispatch) => {
    this.api.getData(url, data => {
      dispatch(getNotesSuccess(data))
    })
  }
}

export const adminStoresDetails = () => {
  this.api = new Api()
  let stores = {}
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=1'
  this.api.getData(url, data => {
    // stores = data.data
    stores = {
      'storeList': [
        {
          'ID': 6,
          'Brand_Name': "McDonald's",
          'Store_UID': 'E7E33B61A99B41F6A9771674561E76D2',
          'Store_Number': '00202003',
          'Store_Name': null,
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83168,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'CIB',
              'Device_MainVersion': '2.12.3',
              'Device_IsActive': 1,
              'Device_ID': 4504,
              'Device_UID': '02088391-4C70-49D7-83B2-625E521C22BE',
              'Device_DeviceType_ID': 4,
              'Device_LaneConfig_ID': 255,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            },
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111441,
              'Device_UID': 'BD8EF615-A0C0-478D-860B-1552CE9C712F',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 4,
          'Brand_Name': "McDonald's",
          'Store_UID': 'BBF497EC67064E408079740AF71D4ACE',
          'Store_Number': '00202001',
          'Store_Name': null,
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83148,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'CIB',
              'Device_MainVersion': '2.12.3',
              'Device_IsActive': 1,
              'Device_ID': 20262,
              'Device_UID': '2DED10EB-F36B-4E24-BAD7-BEC0BBA4448A',
              'Device_DeviceType_ID': 4,
              'Device_LaneConfig_ID': 255,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            },
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111439,
              'Device_UID': '276E55FF-2A73-4A97-B6AC-715D51B6FCF1',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 3,
          'Brand_Name': "McDonald's",
          'Store_UID': '3138B2ED711D402796FC344D89BBB8B4',
          'Store_Number': '00202000',
          'Store_Name': 'McDonalds 202000',
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83157,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group A',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111438,
              'Device_UID': 'B4422D64-1A01-492A-9A5B-1AF2FEF7572B',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 5,
          'Brand_Name': "McDonald's",
          'Store_UID': '58016299F46F42C1864027D20C49DBFC',
          'Store_Number': '00202002',
          'Store_Name': null,
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83111,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111440,
              'Device_UID': '6AC2CBDF-F04A-4104-AB60-6E67B99647B0',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 7,
          'Brand_Name': "McDonald's",
          'Store_UID': '5AA6A4BD303046929D36CCE650032F54',
          'Store_Number': '00202004',
          'Store_Name': null,
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83146,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111442,
              'Device_UID': '188F8905-E95B-4907-A3FC-7991F389AF40',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 8,
          'Brand_Name': "McDonald's",
          'Store_UID': 'AB87440C4A3F47BE8715375A19252554',
          'Store_Number': '00202005',
          'Store_Name': 'La 2005',
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83110,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111443,
              'Device_UID': '4B12539E-28C7-4BFD-BF49-977977E359B7',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 9,
          'Brand_Name': "McDonald's",
          'Store_UID': 'FB5D3B7BEA584F9795F0120D7209BFA9',
          'Store_Number': '00202006',
          'Store_Name': null,
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83160,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111444,
              'Device_UID': '008A5A69-7E38-45F1-A4BB-54942BB3113E',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 10,
          'Brand_Name': "McDonald's",
          'Store_UID': 'B7BAF30FE72343D1826CEC7920D55A25',
          'Store_Number': '00202007',
          'Store_Name': null,
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83191,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111445,
              'Device_UID': '5B4E132D-77F5-4A26-9D8B-1B9D8A94E9B1',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 11,
          'Brand_Name': "McDonald's",
          'Store_UID': '770B4E84DE0B4A78A66110FFC20DFFC7',
          'Store_Number': '00202008',
          'Store_Name': null,
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83098,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111446,
              'Device_UID': '4BEB1EA3-2C9E-4F5F-830A-1B7FFBE68340',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 12,
          'Brand_Name': "McDonald's",
          'Store_UID': 'FE0CBC2A1360432C867B0D22A2235C40',
          'Store_Number': '00202009',
          'Store_Name': null,
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83059,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111447,
              'Device_UID': '4BA53A97-94D3-4E09-A5F1-D181745EFE6C',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 13,
          'Brand_Name': "McDonald's",
          'Store_UID': '8353A14DA5724012BE63820D31788525',
          'Store_Number': '00202010',
          'Store_Name': 'tested store',
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83506,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111810,
              'Device_UID': '8C84FA5F-1FA6-4C7C-BE75-4B5460873DB2',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 14,
          'Brand_Name': "McDonald's",
          'Store_UID': 'ABFA44946A7146E1997D3E302F3DAC43',
          'Store_Number': '00202011',
          'Store_Name': null,
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83507,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111811,
              'Device_UID': 'E459A91B-9ADE-4CA0-918A-63062B6CAFB3',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 15,
          'Brand_Name': "McDonald's",
          'Store_UID': 'D0D7496F8A5C48BBBC76E1DC971530C4',
          'Store_Number': '00202012',
          'Store_Name': '00202012',
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 83532,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': 'ZOOM',
              'Device_MainVersion': '2.31.7.999',
              'Device_IsActive': 0,
              'Device_ID': 111820,
              'Device_UID': '48271618-9F56-4766-8766-3CD367CBAB9E',
              'Device_DeviceType_ID': 1,
              'Device_LaneConfig_ID': 1,
              'Device_EmailAccount': 'mcamacho2025.2+37@gmail.com',
              'Device_Timezone_ID': 2
            }
          ]
        },
        {
          'ID': 16,
          'Brand_Name': "McDonald's",
          'Store_UID': 'B0711EF2775F40C8B252DB6EEB15BB3B',
          'Store_Number': '201000',
          'Store_Name': 'Hola proxy',
          'Store_AddressLine1': '14110 Stowe Dr',
          'Store_Locality': 'Poway',
          'Store_Region': 'CA',
          'Store_ID': 84637,
          'Store_Company_ID': 1397,
          'Group_Name': 'Group D',
          'Device_Details': [
            {
              'Device_Name': null,
              'Device_MainVersion': null,
              'Device_IsActive': null,
              'Device_ID': null,
              'Device_UID': null,
              'Device_DeviceType_ID': null,
              'Device_LaneConfig_ID': null,
              'Device_EmailAccount': null,
              'Device_Timezone_ID': null
            }
          ]
        }
      ],
      'userPermessions': [
        'AddRole',
        'AddUser',
        'EditLeaderboard',
        'EditRole',
        'EditStoreBasic',
        'EditUser',
        'PerformDeviceRestart',
        'RemoteConnect',
        'RemoveRole',
        'RemoveUser',
        'ViewAllStores'
      ],
      'status': true
    }
  })

  stores = {
    'storeList': [
      {
        'Store_ID': 246,
        'Store_Number': '660066',
        'Store_Name': null,
        'Store_UID': '31586E786D6241F893186D4C63283740',
        'Store_AddressLine1': 'testing',
        'Company_Name': 'Sohail Inc.',
        'Company_ID': 163,
        'Brand_Name': 'In-N-Out Burger',
        'Device_Details': [
          {
            'Device_Name': 'ZOOM',
            'Device_UID': '1E24D736-BAF0-41DE-9AF6-B6B0388FFD7B',
            'Device_ID': 1405,
            'Device_EmailAccount': 'soqahme@gmail.com',
            'Device_IsActive': 1,
            'Device_MainVersion': '2.00.338',
            'Device_SerialNumber': 'UATSIM02',
            'Subscription_Name': 'Premium Store Subscription'
          }
        ]
      },
      {
        'Store_ID': 1305,
        'Store_Number': 'Mcd1234',
        'Store_Name': null,
        'Store_UID': '6F838347A51A4D6CB6A860EEB77F5D47',
        'Store_AddressLine1': '',
        'Company_Name': 'QA Test Lab',
        'Company_ID': 1202,
        'Brand_Name': "McDonald's",
        'Device_Details': [
          {
            'Device_Name': 'EOS',
            'Device_UID': 'AC7FFABC-80CE-469B-8747-FA3AD188FFDA',
            'Device_ID': 2951,
            'Device_EmailAccount': 'qatestlab@hme.com',
            'Device_IsActive': 0,
            'Device_MainVersion': '1.20.4',
            'Device_SerialNumber': '00-1D-06-02-12-A8',
            'Subscription_Name': 'Premium Store Subscription'
          },
          {
            'Device_Name': 'ION',
            'Device_UID': 'C2A816D7-37BC-4A22-95F8-33E20FC5C4DE',
            'Device_ID': 2954,
            'Device_EmailAccount': 'qatestlab@hme.com',
            'Device_IsActive': 0,
            'Device_MainVersion': '3.20.1',
            'Device_SerialNumber': '00-1D-06-02-18-A8',
            'Subscription_Name': 'Premium Store Subscription'
          }
        ]
      },
      {
        'Store_ID': 1408,
        'Store_Number': 'Mobiquity Test',
        'Store_Name': null,
        'Store_UID': 'A79A5EF7265B4323824CDFBFD5822F40',
        'Store_AddressLine1': '',
        'Company_Name': 'Mobiquity',
        'Company_ID': 1242,
        'Brand_Name': 'Taco Bell',
        'Device_Details': [
          {
            'Device_Name': 'EOS',
            'Device_UID': '06206F64-4790-41EC-B0E1-859B60ABE667',
            'Device_ID': 3100,
            'Device_EmailAccount': 'atnelsonhme+tacobell@gmail.com',
            'Device_IsActive': 0,
            'Device_MainVersion': '2.01.3',
            'Device_SerialNumber': '',
            'Subscription_Name': 'Premium Store Subscription'
          }
        ]
      },
      {
        'Store_ID': 1501,
        'Store_Number': '18014',
        'Store_Name': null,
        'Store_UID': '0E8F409C853A495C8A83606F719166F9',
        'Store_AddressLine1': '10655 Scripps Poway Parkway',
        'Company_Name': 'HME UAT',
        'Company_ID': 191,
        'Brand_Name': 'Other',
        'Device_Details': [
          {
            'Device_Name': 'ZOOM',
            'Device_UID': '77830DFD-A036-497A-BA3A-9058E7813DD8',
            'Device_ID': 2928,
            'Device_EmailAccount': 'engrtesting@gmail.com',
            'Device_IsActive': 0,
            'Device_MainVersion': '2.31.7',
            'Device_SerialNumber': '12345688',
            'Subscription_Name': 'Premium Store Subscription'
          }
        ]
      }
    ],
    'userPermessions': [],
    'status': true
  }

  return {
    type: storeDetails.ADMIN_STORESDETAILS,
    adminStoreDetails: stores
  }
}

export const sortStores = (sortParams) => {
  return {
    type: storeDetails.SET_SORT_PARAMS,
    sortParams: sortParams
  }
}

export const deviceDetails = () => {
  this.api = new Api()
  let url = 'https://hme-dev-public-cloud-func.azurewebsites.net/api/store/getStore?suid=7F671C950B924E4CA61A5E7975765BB0'
  this.api.getData(url, data => {
    return data
  })
}
