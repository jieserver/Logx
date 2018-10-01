# Logx
a simply Unified Logging Service base dgram UDP4

## log4js provider
write a **single js file**
```
module.exports = {
    configure(config) {
        const upd = dgram.createSocket('udp4');
        return function log(event) {
            const buff = Buffer.from(JSON.stringify(event));
            upd.send(buff, 0, buff.length, config.port, config.host)
        }
    }
}
```
## config log4js
set log4js confis
```
{
    "appenders": {
      "udp": {
        "type": "provider/js/file/path",
        "host": "logx.service.ip.address",
        "port": logx.upd.binding.port
      }
    },
    "categories": {
      "default": { "appenders": [ "udp" ] }
    }
}
```
## fetch and listen log
Use socekt.io client.Listen on 'log' 'categoryName' 'levelString'

### *Html-Template*
~~~
<html style="height:100%">
    <title>Logx</title>
    <head>
        <meta charset="utf-8"/>
        <style type="text/css">::-webkit-scrollbar {display:none} img {width:100%}</style>
    </head>
    <body id="body" style="height:100%;background:url(_back_) no-repeat 0 0 / cover">
        <a href="_back_" target="_blank">V</a>
        <div id="content" style="margin:0% 20%; overflow:scroll;
            width:60%;height:86%;background: rgba(255,255,255,0.5);
            border: 20px solid rgba(255,255,255,0.05)">
            _content_
        </div>
    </body>
</html>
~~~