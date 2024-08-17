#include "clicker.h"
#include "utils.h"
#include "global.h"
#include <thread>

// TODO: Clicker conditions

void sendClick(std::string type, double cps) {
	double delay = 1000 / cps;

	if (type == "left") {
		PostMessage(GetForegroundWindow(), WM_LBUTTONDOWN, MK_LBUTTON, MAKELPARAM(0, 0));

		std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(delay / 2)));

		PostMessage(GetForegroundWindow(), WM_LBUTTONUP, MK_LBUTTON, MAKELPARAM(0, 0));
		std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(delay / 2)));
	}

	if (type == "right") {
		PostMessage(GetForegroundWindow(), WM_RBUTTONDOWN, MK_RBUTTON, MAKELPARAM(0, 0));

		std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(delay/2)));

		PostMessage(GetForegroundWindow(), WM_RBUTTONUP, MK_RBUTTON, MAKELPARAM(0, 0));

		std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(delay / 2)));
	}
}

void leftClickerThread() {
	while (!global::destruct) {
		if (!utils::inJava()) {
			std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(1000)));
			continue;
		}

		if (!GetAsyncKeyState(VK_LBUTTON) || !clicker::leftclickerEnabled) {
			std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(1000)));
			continue;
		}

		if (GetAsyncKeyState(clicker::leftclickerBind) & 0x8000 && clicker::leftclickerBind != 0) {
			clicker::leftclickerEnabled = !clicker::leftclickerEnabled;
			std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(200)));
			std::cout << "toggled autoclicker " << clicker::leftclickerEnabled << "\n";
		}

		sendClick("left", clicker::leftclickerCps);
		//std::cout << "LEFTclicking";
	}
}

void rightClickerThread() {
	while (!global::destruct) {
		if (!utils::inJava()) {
			std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(1000)));
			//std::cout << "not inside minecraft \n";
			continue;
		}

		if (!GetAsyncKeyState(VK_RBUTTON) || !clicker::rightclickerEnabled) {
			std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(1000)));
			continue;
		}

		if (GetAsyncKeyState(clicker::rightclickerBind) & 0x8000 && clicker::rightclickerBind != 0) {
			clicker::rightclickerEnabled = !clicker::rightclickerEnabled;
			std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(200)));
			std::cout << "toggled autoclicker " << clicker::rightclickerEnabled << "\n";
		}

		sendClick("right", clicker::rightclickerCps);
		//std::cout << "RIGHTclicking";
	}
}

void clicker::startThreads() {
	std::thread(leftClickerThread).detach();
	std::thread(rightClickerThread).detach();
}