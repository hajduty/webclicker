#include <iostream>
#include "tcpclient.h"
#include <Windows.h>
#include "clicker.h"
#include "global.h"

int main() {
    try {
        TcpClient client("localhost", "4402");

        clicker::startThreads();
        client.start();
    }
    catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
        return 1;
    }

	while (!global::destruct) {
		std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(100)));
	}

	return 0;
}