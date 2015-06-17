function UrlDecode(zipStr){
    var uzipStr="";
    for(var i=0;i<zipStr.length;i++){
        var chr = zipStr.charAt(i);
        if(chr == "+"){
            uzipStr+=" ";
        }else if(chr=="%"){
            var asc = zipStr.substring(i+1,i+3);
            if(parseInt("0x"+asc)>0x7f){
                uzipStr+=decodeURI("%"+asc.toString()+zipStr.substring(i+3,i+9).toString());
                i+=8;
            }else{
                uzipStr+=AsciiToString(parseInt("0x"+asc));
                i+=2;
            }
        }else{
            uzipStr+= chr;
        }
    }

    return uzipStr;
}

function StringToAscii(str){
    return str.charCodeAt(0).toString(16);
}
function AsciiToString(asccode){
    return String.fromCharCode(asccode);
}

var websocket = null,           //websocket object
    show_first_resp = true,     //是否一直显示首次应答
    curr_req = '',              //当前请求串
    curr_req_seq = -1;          //当前请求编号

//发送请求
function sendRequest(){
    curr_req = document.getElementById('RequestCode').value;
    if(curr_req.length){
        websocket.send(curr_req);
    }
}

//取消请求
function cancelRequest() {
    if(curr_req_seq != -1){
        websocket.send('/json/cancel?'+curr_req_seq);
        curr_req_seq = -1;
        document.getElementById("ResponseResult").value = "";
    }
}

//提交请求
function submitRequest() {
    cancelRequest();
    sendRequest();
}

function initWebsocket() {
    if(!websocket){
        //创建websocket
        websocket = new WebSocket("ws://10.15.107.138:20718/ws");
        websocket.binaryType = "arraybuffer";
        //监听WS打开
        websocket.onopen = function (evt) {
            console.log("websocket opened");
            sendRequest();
        };
        //监听WS关闭
        websocket.onclose = function (evt) {
            console.log("websocket closed");
        };
        //监听WS消息
        websocket.onmessage = function (evt) {
            if(evt.data == null){
                return
            }
            //解压缩数据
            var json = _zlib(evt.data),
                resp = JSON.parse(json),
                json_str = JSON.stringify(resp, null, 4),
                elem_resp = document.getElementById("ResponseResult"),
                resp_content = elem_resp.value;
            if(resp.res_seq == 0){
                /*   首次响应
                 * {
                 *    "req_seq": "0",
                 *    "res_seq": "0",
                 *    "res_type": "0"
                 * }
                 * */
                curr_req_seq = resp.req_seq;
                if(show_first_resp){
                    resp_content =  'First Response(ID)\n'
                    resp_content += json_str + '\n';
                }else{
                    resp_content = json_str;
                }
            }else{
                /*第二次及后续应答
                 * {
                 *   "req_seq": "1",
                 *   "res_seq": "1",
                 *   "res_type": "0",
                 *   "stat": {
                 *       "data_change": "1",
                 *       "last_response": "0",
                 *       "data_clear_response": "0"
                 *   },
                 *   "result": {
                 *       "head": [
                 *       "obj",
                 *       "name",
                 *       "new",
                 *       "time"
                 *       ],
                 *       "datas": [
                 *           [
                 *               "SH600000.stk",
                 *               "浦发银行",
                 *               18.440001,
                 *               1434546525
                 *           ]
                 *       ]
                 *   }
                 * }
                 **/
                if(show_first_resp){
                    var pos = resp_content.indexOf('}\n');
                    if(pos != -1){
                        resp_content = resp_content.substring(0, pos+2);
                    }
                    resp_content += '\n';
                    resp_content += '' + (Number(resp.res_seq)+1) + ' Times Response(Data)\n';
                    resp_content += json_str + '\n';
                }else{
                    resp_content = json_str;
                }
            }
            //数据显示
            elem_resp.value = resp_content;
        };
        //监听WS异常
        websocket.onerror = function (evt) {
            alert("websocket occur error:" + JSON.stringify(evt, null, 4));
        };
    }
}