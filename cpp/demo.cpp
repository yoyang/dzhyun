define  NOMINMAX
#define  _WEBSOCKETPP_CPP11_FUNCTIONAL_
#define  _WEBSOCKETPP_CPP11_MEMORY_

#include  <iostream>
#include  <string>
#include  <boost/thread.hpp>
#include  <websocketpp/config/asio_no_tls_client.hpp>
#include  <websocketpp/client.hpp>

using  namespace std;

typedef websocketpp::client<websocketpp::config::asio_client > WSClient;
typedef websocketpp::config::asio_client::message_type::ptr message_ptr;

using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

void on_message(WSClient* c, websocketpp::connection_hdl hdl, message_ptr msg) {
        if (msg->get_opcode() == websocketpp::frame::opcode::binary) {
            cout<<"recv req msg = "<<msg->get_payload()<<endl;
        } else {
            cout<<"recv push msg"<<msg->get_payload()<<endl;
        }
}

int main( int  argc , char ** argv )
{
        string sUrl = "ws://10.15.43.217:20718/dataproxy";
        // cretae endpoint   
        WSClient   mEndPoint;
        // initial endpoind  
        mEndPoint.init_asio();
        mEndPoint.start_perpetual();
        boost:: thread wsThread( [&mEndPoint](){ mEndPoint.run (); } );

        // set handler  
        mEndPoint.set_message_handler(websocketpp::lib::bind(
            &on_message,
            &mEndPoint,
            websocketpp::lib::placeholders::_1,
            websocketpp::lib::placeholders::_2
        ));

        // get connection and connect   
        websocketpp::lib:: error_code ec;
        WSClient :: connection_ptr wsCon = mEndPoint.get_connection( sUrl, ec);
        mEndPoint.connect( wsCon );

        cout<<"按任意键发送请求，并开始接收数据..."<<endl;
        getchar();
        string strUrl = "/json/quote/dyna?where=obj=SH600000.stk&response_times=-1"        cout<<"send msg = "<<strUrl.c_str()<<endl;
        mEndPoint.send(wsCon->get_handle(), strUrl, websocketpp::frame::opcode::binary, ec);
        if (ec) {
            std::cout << "> Error sending message: " << ec.message() << std::endl;
            return -1;
        }

		cout<<"按任意键发送请求，并取消请求..."<<endl;
        getchar();
        string strCancel = "/json/cancel?0";
        cout<<"cancel url : "<<strCancel.c_str()<<endl;
        mEndPoint.send(wsCon->get_handle(), strCancel, websocketpp::frame::opcode::binary, ec);
        if (ec) {
            std::cout << "> Error sending message: " << ec.message() << std::endl;
            return -1;
        }

        mEndPoint.stop_perpetual();
        //wsThread.join ();  
        return 0;
};

