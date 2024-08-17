#include <iostream>
#include <Windows.h>
#include <codecvt>

namespace utils {
	inline bool inJava() {
		return GetForegroundWindow() == FindWindowA(("LWJGL"), NULL);
	}

	inline void toClipboard(std::string str) {
		const char* output = str.c_str();
		const size_t len = strlen(output) + 1;
		HGLOBAL hMem = GlobalAlloc(GMEM_MOVEABLE, len);
		memcpy(GlobalLock(hMem), output, len);
		GlobalUnlock(hMem);
		OpenClipboard(0);
		EmptyClipboard();
		SetClipboardData(CF_TEXT, hMem);
		CloseClipboard();
	}
}

namespace utils {
	inline std::string getSerial() { //https://gist.github.com/micjabbour/a2fbe50160862e6abe439c0b0769c3fb
		//get a handle to the first physical drive
		HANDLE h = CreateFileW(L"\\\\.\\PhysicalDrive0", 0, FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING, 0, NULL);
		if (h == INVALID_HANDLE_VALUE) return {};
		//an std::unique_ptr is used to perform cleanup automatically when returning (i.e. to avoid code duplication)
		std::unique_ptr<std::remove_pointer<HANDLE>::type, void(*)(HANDLE)> hDevice{ h, [](HANDLE handle) {CloseHandle(handle); } };
		//initialize a STORAGE_PROPERTY_QUERY data structure (to be used as input to DeviceIoControl)
		STORAGE_PROPERTY_QUERY storagePropertyQuery{};
		storagePropertyQuery.PropertyId = StorageDeviceProperty;
		storagePropertyQuery.QueryType = PropertyStandardQuery;
		//initialize a STORAGE_DESCRIPTOR_HEADER data structure (to be used as output from DeviceIoControl)
		STORAGE_DESCRIPTOR_HEADER storageDescriptorHeader{};
		//the next call to DeviceIoControl retrieves necessary size (in order to allocate a suitable buffer)
		//call DeviceIoControl and return an empty std::string on failure
		DWORD dwBytesReturned = 0;
		if (!DeviceIoControl(hDevice.get(), IOCTL_STORAGE_QUERY_PROPERTY, &storagePropertyQuery, sizeof(STORAGE_PROPERTY_QUERY),
			&storageDescriptorHeader, sizeof(STORAGE_DESCRIPTOR_HEADER), &dwBytesReturned, NULL))
			return {};
		//allocate a suitable buffer
		const DWORD dwOutBufferSize = storageDescriptorHeader.Size;
		std::unique_ptr<BYTE[]> pOutBuffer{ new BYTE[dwOutBufferSize]{} };
		//call DeviceIoControl with the allocated buffer
		if (!DeviceIoControl(hDevice.get(), IOCTL_STORAGE_QUERY_PROPERTY, &storagePropertyQuery, sizeof(STORAGE_PROPERTY_QUERY),
			pOutBuffer.get(), dwOutBufferSize, &dwBytesReturned, NULL))
			return {};
		//read and return the serial number out of the output buffer
		STORAGE_DEVICE_DESCRIPTOR* pDeviceDescriptor = reinterpret_cast<STORAGE_DEVICE_DESCRIPTOR*>(pOutBuffer.get());
		const DWORD dwSerialNumberOffset = pDeviceDescriptor->SerialNumberOffset;
		if (dwSerialNumberOffset == 0) return {};
		const char* serialNumber = reinterpret_cast<const char*>(pOutBuffer.get() + dwSerialNumberOffset);
		return serialNumber;
	}

	inline std::string getComputername() {
		wchar_t computerName[MAX_COMPUTERNAME_LENGTH + 1];
		DWORD size = sizeof(computerName) / sizeof(computerName[0]);

		if (!GetComputerNameW(computerName, &size)) {
			std::cerr << "Failed to get computer name. Error code: " << GetLastError() << std::endl;
			return "";
		}

		std::wstring_convert<std::codecvt_utf8<wchar_t>> converter;
		return converter.to_bytes(computerName);
	}
}