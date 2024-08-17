#ifndef TCPCLIENT_H
#define TCPCLIENT_H

#include <string>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <thread>
#include <chrono>
#include <WinSock2.h>
#include <WS2tcpip.h>

#pragma comment(lib, "Ws2_32.lib")
#pragma comment(lib, "Mswsock.lib")
#pragma comment(lib, "AdvApi32.lib")

class TcpClient {
public:
    TcpClient(const std::string& server, const std::string& port);
    ~TcpClient();

    void start();
    void stop();
    void sendMessage(const std::string& message);

private:
    void sendThread();
    void receiveThread();
    void monitorConnection();
    void resetTimer();
    void closeConnection();

    SOCKET connectSocket;
    std::mutex mtx;
    std::condition_variable cv;
    std::queue<std::string> messageQueue;
    std::chrono::time_point<std::chrono::steady_clock> lastReceivedTime;
    bool destruct = false;

    std::thread sendThreadHandle;
    std::thread receiveThreadHandle;
    std::thread monitorThreadHandle;
};

#endif // TCPCLIENT_H
