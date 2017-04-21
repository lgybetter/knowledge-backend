/**
 * Created by Administrator on 2017/4/21.
 */
'use strict';
function recursive_print_routersx(r, prefixs){

    let s = r.stack;
    if(!s){
        return;
    }

    for(let i = 0;i < s.length; i++){

        let si = s[i];

        let method = {};

        let path = si.path || si.regexp;

        if(si.route){

            for(let j=0;j<si.route.stack.length;j++){
                method[si.route.stack[j].method] = true;
            }
            if(si.route.methods){
                let methods = Object.keys(si.route.methods);
                for(let j=0;j<methods;j++){
                    method[methods[j]] = true;
                }
                if(si.route.path){
                    path = si.route.path;
                }
            }
        }
        let name = "<anonymous>";
        if(si.name != "bound dispatch"){
            name = si.name;
        }
        if(name == "<anonymous>"){
            name = "";
        }
        if(name == "router"){
            name = "";
        }

        console.log(Object.keys(method).join(',') || 'all', prefixs.concat(path).join(''), name);

        if(typeof si.handle!=='undefined'){
            recursive_print_routers(si.handle, prefixs.concat(path));
        }
    }
}
function recursive_print_routers(obj){
    for(var key in obj){
        var value = obj[key];

        if(key.indexOf("xx")!=-1){
            console.log(key, value);
        }
        if(typeof value === 'object'){
            recursive_print_routers(value);
        }
    }
}
module.exports = {recursive_print_routers};
