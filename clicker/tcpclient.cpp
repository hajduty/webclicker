#include "tcpclient.h"
#include "global.h"
#include "json.hpp"
#include "clicker.h"
#include "utils.h"
#include <iostream>
#include <WS2tcpip.h>
#include <chrono>
#include <thread>

TcpClient::TcpClient(const std::string& server, const std::string& port)
    : connectSocket(INVALID_SOCKET), destruct(false) {
    WSADATA wsaData;
    int result = WSAStartup(MAKEWORD(2, 2), &wsaData);
    if (result != 0) {
        throw std::runtime_error("WSAStartup failed: " + std::to_string(result));
    }

    struct addrinfo* addrResult = nullptr;
    struct addrinfo hints = { 0 };
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_protocol = IPPROTO_TCP;

    result = getaddrinfo(server.c_str(), port.c_str(), &hints, &addrResult);
    if (result != 0) {
        WSACleanup();
        throw std::runtime_error("getaddrinfo failed: " + std::to_string(result));
    }

    connectSocket = socket(addrResult->ai_family, addrResult->ai_socktype, addrResult->ai_protocol);
    if (connectSocket == INVALID_SOCKET) {
        freeaddrinfo(addrResult);
        WSACleanup();
        throw std::runtime_error("Error at socket(): " + std::to_string(WSAGetLastError()));
    }

    result = connect(connectSocket, addrResult->ai_addr, static_cast<int>(addrResult->ai_addrlen));
    if (result == SOCKET_ERROR) {
        closesocket(connectSocket);
        connectSocket = INVALID_SOCKET;
    }

    freeaddrinfo(addrResult);

    if (connectSocket == INVALID_SOCKET) {
        WSACleanup();
        throw std::runtime_error("Unable to connect to server!");
    }

    resetTimer();
}

TcpClient::~TcpClient() {
    stop();
    closeConnection();
    WSACleanup();
}

void TcpClient::start() {
    sendThreadHandle = std::thread(&TcpClient::sendThread, this);
    receiveThreadHandle = std::thread(&TcpClient::receiveThread, this);
    monitorThreadHandle = std::thread(&TcpClient::monitorConnection, this);

    nlohmann::json login;
    login["Type"] = "sendhwid";
    std::string serial = utils::getSerial() + utils::getComputername();
    login["Contents"] = serial;
    sendMessage(login.dump());

    std::this_thread::sleep_for(std::chrono::seconds(1));

    nlohmann::json config;
    config["Type"] = "getConfig";
    std::this_thread::sleep_for(std::chrono::seconds(1));
    sendMessage(config.dump());
    utils::toClipboard(serial);

    if (sendThreadHandle.joinable()) sendThreadHandle.join();
    if (receiveThreadHandle.joinable()) receiveThreadHandle.join();
    if (monitorThreadHandle.joinable()) monitorThreadHandle.join();
}

void TcpClient::stop() {
    {
        std::lock_guard<std::mutex> lock(mtx);
    }
    cv.notify_all();
}

void TcpClient::sendMessage(const std::string& message) {
    {
        std::lock_guard<std::mutex> lock(mtx);
        messageQueue.push(message);
    }
    cv.notify_one();
}

void TcpClient::sendThread() {
    while (!destruct) {
        std::string message;
        {
            std::unique_lock<std::mutex> lock(mtx);
            cv.wait(lock, [this] { return !messageQueue.empty() || destruct; });

            if (destruct) break;

            message = messageQueue.front();
            messageQueue.pop();
        }

        if (!message.empty()) {
            int result = send(connectSocket, message.c_str(), static_cast<int>(message.length()), 0);
            if (result == SOCKET_ERROR) {
                std::cerr << "send failed: " << WSAGetLastError() << std::endl;
                break;
            }

            std::lock_guard<std::mutex> lock(mtx);
            std::cout << "Sent: " << message << std::endl;
        }
    }
}

void TcpClient::receiveThread() {
    const int recvbuflen = 1024;
    char recvbuf[recvbuflen];
    u_long mode = 1;
    ioctlsocket(connectSocket, FIONBIO, &mode);

    fd_set readfds;
    timeval timeout;
    int result;

    while (true) {
        FD_ZERO(&readfds);
        FD_SET(connectSocket, &readfds);

        timeout.tv_sec = 1;
        timeout.tv_usec = 0;

        result = select(0, &readfds, nullptr, nullptr, &timeout);

        if (destruct) {
            break;
        }

        if (result == SOCKET_ERROR) {
            std::cerr << "select failed: " << WSAGetLastError() << std::endl;
            break;
        }
        else if (result == 0) {
            std::lock_guard<std::mutex> lock(mtx);
        }
        else {
            result = recv(connectSocket, recvbuf, recvbuflen - 1, 0);
            if (result > 0) {
                recvbuf[result] = '\0';
                resetTimer();

                std::string msg(recvbuf);
                std::cout << "Received: " << msg << std::endl;

                try {
                    nlohmann::json j = nlohmann::json::parse(msg);
                    std::string type = j.value("Type", "");

                    if (type == "sendhwid") {
                        std::string hwid = j["Contents"].get<std::string>();
                        std::cout << "Received HWID: " << hwid << std::endl;
                    }

                    if (j.contains("Email")) {
                        if (j.contains("leftclickerEnabled")) clicker::leftclickerEnabled = j["leftclickerEnabled"];
                    }

                    if (j.contains("_key") && j.contains("_value")) {
                        auto val = j["_value"];
                        std::string key = j["_key"];

                        if (key == "leftclickerEnabled") clicker::leftclickerEnabled = val;
                        if (key == "leftclickerBind") clicker::leftclickerBind = val;
                        if (key == "leftclickerCps") clicker::leftclickerCps = val;
                        if (key == "leftJitter") clicker::leftJitter = val;
                        if (key == "rightclickerEnabled") clicker::rightclickerEnabled = val;
                        if (key == "rightclickerBind") clicker::rightclickerBind = val;
                        if (key == "rightclickerCps") clicker::rightclickerCps = val;
                        if (key == "rightJitter") clicker::rightJitter = val;
                        if (key == "allowEat") clicker::allowEat = val;
                        if (key == "blockhitChance") clicker::blockhitChance = val;
                        if (key == "breakBlocks") clicker::breakBlocks = val;
                        if (key == "clickInMenu") clicker::clickInMenu = val;
                        if (key == "lockLeft") clicker::lockLeft = val;
                        if (key == "onlyClickIngame") clicker::onlyClickIngame = val;
                        if (key == "shiftDisable") clicker::shiftDisable = val;
                        if (key == "exit") {
                            global::destruct = true;
                            destruct = true;
                            cv.notify_all();
                            break;
                        }
                        if (key == "destruct") {
                            //destruct::registryDestruct();
                            //destruct::csrssDestruct();
                        }
                    }
                    else {
                        std::cerr << "Unknown or unsupported message type." << msg << std::endl;
                    }
                }
                catch (const std::exception& e) {
                    std::cerr << e.what();
                }
            }
            else if (result == 0) {
                std::cout << "Connection closed by server." << std::endl;
                break;
            }
            else {
                int errorCode = WSAGetLastError();
                if (errorCode != WSAEWOULDBLOCK) {
                    std::cerr << "recv failed: " << errorCode << std::endl;
                    break;
                }
            }
        }
    }
}

void TcpClient::monitorConnection() {
    while (!destruct) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    
        auto now = std::chrono::steady_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::minutes>(now - lastReceivedTime).count();
    
        if (duration >= 1) {
            global::destruct = true;
            destruct = true;
            stop();
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            break;
        }
    }
}

void TcpClient::resetTimer() {
    std::lock_guard<std::mutex> lock(mtx);
    lastReceivedTime = std::chrono::steady_clock::now();
}

void TcpClient::closeConnection() {
    if (connectSocket != INVALID_SOCKET) {
        closesocket(connectSocket);
        connectSocket = INVALID_SOCKET;
    }
}