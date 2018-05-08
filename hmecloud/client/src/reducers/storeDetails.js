

export default function(state=null,action)
{
    switch(action.type)
    {
        case 'STORE_DETAILS':
        return [
            {title:"As you don't like it",pages:100},
            {title:"Ignited Minds",pages:200},
            {title:"Effective C++ ",pages:234},
            {title:"Peace is humanity"},
            {title:"World we live"}
        ];
    }
    return state;
}