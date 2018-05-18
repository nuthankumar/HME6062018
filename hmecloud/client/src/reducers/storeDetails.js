
export default function(state=null,action)
{
    switch(action.type)
    {
        case 'STORE_DETAILS':
        return action.payload;
    }
    
    // case goals.PUSH_STAGE_REG_API_ERROR:
    // return {
    // ...state,
    // stagingRegistration: action.payload.response
    // }; 
    return state;
}