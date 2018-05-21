
import * as storeDetails from "../actionTypes/StoreDetails/storeDetails";

const storeViewDetails = [
    {
        viewDetails: [
            {
                header: "System Settings Group",
                items: [{
                    Settings: "Store_ID",
                    Value: 3001
                }, {
                    Settings: "Deprecated",
                    Value: 0,
                }, {
                    Settings: "Manager Code",
                    Value: 0
                }]
            },
            {
                header: "Installer Settings Group",
                items: [{
                    Settings: "Store_ID",
                    Value: 3001
                },
                {
                    Settings: "Deprecated",
                    Value: 0,
                }, {
                    Settings: "Manager Code",
                    Value: 0
                }]
            }
        ],
        status: true
    }
];

export const initViewStoresDetails = () => {
    return {
        type: storeDetails.INIT_STORESDETAILS,
        storeViewDetails
    }
};
