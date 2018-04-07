if(!global.instance)
{
 var instance = {};
 instance.state = false;
 
 instance.func1 = function(state){
   instance.state = state;
 };
 global.instance = instance;
}
 
exports.instance = global.instance;