import * as storeDetails from "../../actionTypes/StoreDetails/storeDetails";

const  viewDetails=[
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
                ]
               

export default function (state = viewDetails, action) {
    switch (action.type) {
        case storeDetails.INIT_STORES_VIEW_DETAILS:
        debugger
            return {
                ...state,
            storeViewDetails:action.storeViewDetails

            };
    }
    return state;
}
