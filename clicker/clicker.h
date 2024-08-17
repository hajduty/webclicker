#pragma once

namespace clicker  {
	inline double leftclickerCps = 12;
	inline double leftJitter = 0;
	inline int leftclickerBind = 0;
	inline bool leftclickerEnabled = true;

	inline double rightclickerCps = 20;
	inline double rightJitter = 0;
	inline int rightclickerBind = 0;
	inline bool rightclickerEnabled = false;

	inline bool allowEat = false;
	inline bool clickInMenu = false;
	inline bool shiftDisable = false;
	inline bool breakBlocks = false;
	inline bool lockLeft = false;
	inline bool onlyClickIngame = false;
	inline int blockhitChance = 0;
}

namespace clicker {
	void startThreads();
}