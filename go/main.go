package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"time"
)

func main() {
	
	//连接数据服务器
	ws, _, err := websocket.DefaultDialer.Dial("ws://127.0.0.1:20718/dataproxy", nil)
	if err != nil {
		fmt.Println("websocket connect err: ", err)
		return
	}

	var req_id string
	var resp map[string]string
	go func() {

		//首次返回req_seq 用于取消请求
		_, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println("ws read message error:", err)
			return
		}
		fmt.Printf("msg = %s \n", string(msg))
		json.Unmarshal(msg, &resp)
		req_id = resp["req_seq"]

		for {
			//接收数据
			_, msg, err := ws.ReadMessage()
			if err != nil {
				fmt.Println("ws read message error:", err)
				return
			}
			//真实数据
			fmt.Printf("msg = %s \n", string(msg))
		}

	}()

	//发送请求
	reqUrl := "/json/quote/dyna?where=obj=SH600000.stk&response_times=-1"
	err = ws.WriteMessage(websocket.TextMessage, []byte(reqUrl))
	if err != nil {
		fmt.Println("ws write message error: ", err)
		return
	}

	//接收5秒数据后取消请求
	time.Sleep(5 * time.Second)
	cancelUrl := "/json/cancel?" + req_id
	err = ws.WriteMessage(websocket.TextMessage, []byte(cancelUrl))
	if err != nil {
		fmt.Println("ws write message error: ", err)
		return
	}

	time.Sleep(3 * time.Second)

	//关闭连接
	ws.Close()
}
