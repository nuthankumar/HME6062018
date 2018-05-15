
export default function(state=null,action)
{
    switch(action.type)
    {
        case 'STORE_DETAILS':
        return action.payload;
    }
    return state;
}