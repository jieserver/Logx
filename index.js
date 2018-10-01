const config = {
    logPort:18777,
    port:8777,
    store: './.logdb'
}
const logdb = require('level')(config.store,{valueEncoding:'json'})
const debug = require('debug')('Logx')
const udp = require('dgram').createSocket('udp4');
const wss = require('socket.io')(config.port)
/**
 * "startTime":"2018-10-01T04:07:23.554Z"
 * "categoryName":"Sync"
 * "data":[]
 * "level":{"level":20000,"levelStr":"INFO","colour":"green"}
 * "context":{}
 * "pid":14248
 * "cluster":{"workerId":1,"worker":14248}}
 */

udp.on('message',log=>{
    log = JSON.parse(log.toString())
    debug('logx on message',log)
    const now = Date.now()
    logdb.put(`log_c_${log.categoryName}_${now}`,log)
    .then(n=>logdb.put(`log_t_${now}`,log))
    .then(n=>{
        ['log',log.categoryName,log.level.levelStr].forEach(em => {
            debug('websocket broadcast')
            wss.emit(em,log)
        });
    })
}).bind({port:config.logPort,exclusive:true})

wss.on('connection',skt=>{
    skt.on('fetch',(options,cb)=>{
        !cb && (cb=options,options={})
        
        Object.assign(options,{ reverse:true,limit: 25})
        if(!options.gt && !options.gte && !options.lt && !options.lte)
            Object.assign(options,{lte:`log_t_${Date.now()}`,gt:'log_t_'})

        var ret = options.keys && options.values ? {}:[];
        logdb.createReadStream(options)
        .on('data',(d)=>(ret instanceof Array) ? ret.push(d) : ret[d.key] = d.value)
        .on('error',debug)
        .on('end',n=>cb(ret))
    })
})

