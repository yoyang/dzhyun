using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using WebSocket4Net;
using SuperSocket.ClientEngine;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
namespace csharpDemo
{
   
    public partial class Form1 : Form
    {

        String strMessage;
        JObject objJson;
        String strRequestId;
        public Form1()
        {
            InitializeComponent();
        }
        WebSocket websocket;
        private void websocket_Opened(object sender, EventArgs e)
        {
            strMessage = "连接成功";
            this.txtResponse.Invoke(new EventHandler(ShowMessage), e);            
        }
        private void websocket_Closed(object sender, EventArgs e)
        {
            strMessage = "连接关闭";
            this.txtResponse.Invoke(new EventHandler(ShowMessage), e); 
        }
        private void websocket_MessageReceived(object sender, DataReceivedEventArgs e)
        {
            strMessage = Encoding.UTF8.GetString(e.Data);
            objJson = JObject.Parse(strMessage);
            strRequestId = objJson.Value<string>("req_seq");
            strMessage = objJson.ToString();
            this.txtResponse.Invoke(new EventHandler(ShowMessage), e); 
        }
        private void websocket_Error(object sender, ErrorEventArgs e)
        {
            strMessage = e.Exception.ToString();
            this.txtResponse.Invoke(new EventHandler(ShowMessage), e); 
        }
        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void connect_Click(object sender, EventArgs e)
        {
            websocket = new WebSocket("ws://114.80.136.56:20718/dataproxy");
            websocket.Opened += new EventHandler(websocket_Opened);
            websocket.Error += new EventHandler<ErrorEventArgs>(websocket_Error);
            websocket.Closed += new EventHandler(websocket_Closed);
            websocket.DataReceived += new EventHandler<DataReceivedEventArgs>(websocket_MessageReceived);
            websocket.Open();
        }

        private void shutdown_Click(object sender, EventArgs e)
        {
            websocket.Close();
        }

        private void send_Click(object sender, EventArgs e)
        {
            this.websocket.Send(txtRequest.Text.Trim());
        }
        private void ShowMessage(object sender, EventArgs e)
        {
            this.txtResponse.Text = strMessage;
        }

        private void cancel_Click(object sender, EventArgs e)
        {
            this.websocket.Send("/json/cancel?" + strRequestId);
            this.txtResponse.Text = "请求取消";
        }
    }
}
