'use strict';
let socketIORpc = {};
function getApiTable(){
    return socketIORpc;
}

function recursive_collect_apis(r, prefixs){

    let s = r.stack;
    if(!s){
        return;
    }
    for(let i = 0;i < s.length; i++){
        let si = s[i];

        //console.log(JSON.stringify(si, null, '\t'));

        let method = {};


        let path = si.path || si.regexp.source;

        while(true){
          let oldLen = path.length;
          path = path.split("?(?=\\/|$)").join('').split("^\\/").join('/').split('\\/').join('/');

          if(path.length === oldLen){
            break;
          }

        }

        if(si.route){

            //console.log(JSON.stringify(si.route, null, '\t'));

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
        if(si.name !== "bound dispatch"){
            name = si.name;
        }
        if(name === "<anonymous>"){
            name = "";
        }
        if(name === "router"){
            name = "";
        }

        let prefix = prefixs.concat(path).join('');
        while (prefix.indexOf("//") !== -1) {
            prefix = prefix.split("//").join('/');
        }
        if(name === "expressHelper" && si.handle && si.handle.meta){
            let meta = si.handle.meta;
            let supportMethods = meta.supportMethods;
            supportMethods.forEach((m) => {
                method[m] = true;
            });
            let controllerArgs = meta.controllerArgs;
            let opts = meta.opts;

            if (prefix.slice(-1) === "/") {
                prefix = prefix.slice(0, -1);
            }

            //console.log(Object.keys(method).join(',') || 'all', prefix);

            if(typeof socketIORpc[prefix] === 'undefined'){
                socketIORpc[prefix] = [];
            }
            socketIORpc[prefix].push({supportMethods, func: meta.commonHelper, controllerArgs, opts});

            //console.log(JSON.stringify({controllerArgs, opts}));
        }


        if(typeof si.handle!=='undefined'){
            recursive_collect_apis(si.handle, prefixs.concat(path));
        }
    }
}


module.exports = {recursive_collect_apis, getApiTable};
