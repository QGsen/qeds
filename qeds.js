// version v0.0.1
// detail url: https://github.com/ziye12/JavaScript/blob/master/qqread.js

const exec = require('child_process').execSync
const fs = require('fs')
const download = require('download')

const $ = new Env('企鹅读书');
const notify = $.isNode() ? require('./sendNotify') : '';
// 公共变量
const qqreadurl = 'https://mqqapi.reader.qq.com/mqq/user/init'
// 以下需修改
const qqreadheader= {YwSession: 'mh5ealhwphu9u4wm56198fad52o75n12',
  Cookie:
  'ywguid=1046800028;ywkey=ywHW8qZhlUtE;platform=android;channel=mqqmina;mpVersion=0.29.4',
  Referer: 'https://appservice.qq.com/1110657249/0.29.4/page-frame.html','Accept-Language':'zh-cn','Accept-Encoding':'gzip',
  Connection: 'Keep-Alive',
  'Content-Type':'application/json',
  Accept:'*/*',
  HOST: 'mqqapi.reader.qq.com','User-Agent': 'Mozilla%2F5.0+%28Linux%3B+Android+7.1.2%3B+VOG-AL10+Build%2FHUAWEIVOG-AL10%3B+wv%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Version%2F4.0+Chrome%2F75.0.3770.143+Mobile+Safari%2F537.36 QQ/8.4.18.4945 V1_AND_SQ_8.4.18_1558_YYB_D QQ/MiniApp',
  mpVersion:'0.29.4'}
const qqreadtimeurl = 'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=3001&refer=-1&bid=29314315&readTime=6023&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A6023%2C%22pay_status%22%3A0%2C%22is_tail%22%3A0%7D%7D%5D&sp=-1'
const qqreadtimeheader= {YwSession: 'mh5ealhwphu9u4wm56198fad52o75n12',
  Cookie: 'ywguid=1046800028;ywkey=ywHW8qZhlUtE;platform=android;channel=mqqmina;mpVersion=0.29.4;qq_ver=8.4.18.4945;os_ver=Android 7.1.2;mpos_ver=1.21.0;platform=android;openid=42BEFBDB7A2326025719AF66AE8095C4',
  Referer: 'https://appservice.qq.com/1110657249/0.29.4/page-frame.html','Accept-Language':'zh-cn','Accept-Encoding':'gzip',
  Connection: 'Keep-Alive',
  'Content-Type':'application/json',
  Accept:'*/*',
  HOST: 'mqqapi.reader.qq.com','User-Agent': 'Mozilla%2F5.0+%28Linux%3B+Android+7.1.2%3B+VOG-AL10+Build%2FHUAWEIVOG-AL10%3B+wv%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Version%2F4.0+Chrome%2F75.0.3770.143+Mobile+Safari%2F537.36 QQ/8.4.18.4945 V1_AND_SQ_8.4.18_1558_YYB_D QQ/MiniApp',
  mpVersion:'0.29.4'}
// 以上需修改
const SEND_KEY = ''

async function downFile () {
    const url = 'https://raw.fastgit.org/ziye12/JavaScript/master/qqread.js'
    await download(url, './')
}

async function changeFiele () {
    let content = await fs.readFileSync('./qqread.js', 'utf8')
    //替换信息
	content = content.replace("const logs = 1;","const logs = 0;")

	content = content.replace("const qqreadurlVal = $.getdata(qqreadurlKey)",`const qqreadurlVal = '${qqreadurl}'`)

	content = content.replace("const qqreadheaderVal= $.getdata(qqreadheaderKey)",`const qqreadheaderVal= '${qqreadheader}'`)

	content = content.replace("const qqreadtimeurlVal = $.getdata(qqreadtimeurlKey)",`const qqreadtimeurlVal = '${qqreadtimeurl}'`)

	content = content.replace("const qqreadtimeheaderVal= $.getdata(qqreadtimeheaderKey)",`const qqreadtimeheaderVal= '${qqreadtimeheader}'`)

    await fs.writeFileSync( './qqread.js', content, 'utf8')
}

async function deleteFile(path) {
    // 查看文件result.txt是  否存在,如果存在,先删除
    const fileExists = await fs.existsSync(path);
    // console.log('fileExists', fileExists);
    if (fileExists) {
        const unlinkRes = await fs.unlinkSync(path);
        // console.log('unlinkRes', unlinkRes)
    }
}

async function start() {
    if (!qqreadurl | !qqreadheader | !qqreadtimeurl | !qqreadtimeheader) {
        console.log('请填写相关参数后再继续')
        return
    }
    // 下载最新代码
    await downFile();
    console.log('下载代码完毕')
    // 替换变量
    await changeFiele();
    console.log('替换变量完毕')
    // 执行
    await exec("node qqread.js >> result.txt");
    console.log('执行完毕')
    const path = "./result.txt";
    let content = "";
    if (fs.existsSync(path)) {
        content = fs.readFileSync(path, "utf8");
    }
	var moment = require('moment');
    if(SEND_KEY) {
        await notify.sendNotify("企鹅读书 " + moment().format("YYYY-MM-DD HH:mm:ss"), content);
        console.log("企鹅读书 " + moment().format("YYYY-MM-DD HH:mm:ss"), content)
    }else{
		console.log("企鹅读书 " + moment().format("YYYY-MM-DD HH:mm:ss"), content)
	}

    //运行完成后，删除下载的文件
    console.log('运行完成，删除下载的文件\n')
    await deleteFile(path);
	await deleteFile("./qqread.js");

}

start()

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
