'use strict';
let socketIORpc = {};
function getSocketIORpc(){
    return socketIORpc;
};

function recursive_print_routers(r, prefixs){

    let s = r.stack;
    if(!s){
        return;
    }
    for(let i = 0;i < s.length; i++){
        let si = s[i];

        //console.log(si);

        let method = {};

        let path = si.path || si.regexp;

        if(si.route){

            //console.log(si.route);

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

        let prefix = prefixs.concat(path).join('');
        while(prefix.indexOf("//")!=-1){
            prefix = prefix.split("//").join('/');
        }
        if(name === "expressHelper" && si.handle && si.handle.meta){
            let meta = si.handle.meta;
            let supportMethods = meta.supportMethods;
            supportMethods.forEach((m)=>{
                method[m] = true;
            });
            let controllerArgs = meta.controllerArgs;
            let opts = meta.opts;
            console.log(Object.keys(method).join(',') || 'all', prefix);
            if(typeof socketIORpc[prefix] === 'undefined'){
                socketIORpc[prefix] = [];
            }
            socketIORpc[prefix].push({supportMethods, func: meta.commonHelper});

            console.log(JSON.stringify({controllerArgs, opts}));
        }


        if(typeof si.handle!=='undefined'){
            recursive_print_routers(si.handle, prefixs.concat(path));
        }
    }
}

module.exports = {recursive_print_routers, getSocketIORpc};
