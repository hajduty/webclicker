export const valueFormatter = (value: number, whenslice: number) => {
    const stringValue = value.toString();

    if (stringValue.length > 1) {
        const formattedValue = stringValue.slice(0, -whenslice) + '.' + stringValue.slice(-whenslice);
        return parseFloat(formattedValue);
    } else {
        return value;
    }
}

export const keyboardKeys = [
    'NONE', 'Backspace', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'Pause', 'CapsLock', 'Escape', 'Space',
    'PageUp', 'PageDown', 'End', 'Home', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'PrintScreen',
    'Insert', 'Delete', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'Meta', 'ContextMenu', 'NumLock', 'ScrollLock', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
    'Numpad0', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9',
    'NumpadAdd', 'NumpadSubtract', 'NumpadMultiply', 'NumpadDivide', 'NumpadDecimal', 'NumpadEnter',
    'MouseLeft', 'MouseRight', 'MouseMiddle', 'MouseButton4', 'MouseButton5'
];

const keyToVKMap: { [key: string]: number } = {
    'NONE': 0x00,
    'Backspace': 0x08, 'Tab': 0x09, 'Enter': 0x0D, 'Shift': 0x10, 'Control': 0x11, 'Alt': 0x12,
    'Pause': 0x13, 'CapsLock': 0x14, 'Escape': 0x1B, 'Space': 0x20, 'PageUp': 0x21, 'PageDown': 0x22,
    'End': 0x23, 'Home': 0x24, 'ArrowLeft': 0x25, 'ArrowUp': 0x26, 'ArrowRight': 0x27, 'ArrowDown': 0x28,
    'PrintScreen': 0x2C, 'Insert': 0x2D, 'Delete': 0x2E, '0': 0x30, '1': 0x31, '2': 0x32, '3': 0x33,
    '4': 0x34, '5': 0x35, '6': 0x36, '7': 0x37, '8': 0x38, '9': 0x39, 'a': 0x41, 'b': 0x42, 'c': 0x43,
    'd': 0x44, 'e': 0x45, 'f': 0x46, 'g': 0x47, 'h': 0x48, 'i': 0x49, 'j': 0x4A, 'k': 0x4B, 'l': 0x4C,
    'm': 0x4D, 'n': 0x4E, 'o': 0x4F, 'p': 0x50, 'q': 0x51, 'r': 0x52, 's': 0x53, 't': 0x54, 'u': 0x55,
    'v': 0x56, 'w': 0x57, 'x': 0x58, 'y': 0x59, 'z': 0x5A, 'Meta': 0x5B, 'ContextMenu': 0x5D, 'NumLock': 0x90,
    'ScrollLock': 0x91, 'F1': 0x70, 'F2': 0x71, 'F3': 0x72, 'F4': 0x73, 'F5': 0x74, 'F6': 0x75, 'F7': 0x76,
    'F8': 0x77, 'F9': 0x78,'F10': 0x79, 'F11': 0x7A, 'F12': 0x7B,
    'Numpad0': 0x60, 'Numpad1': 0x61, 'Numpad2': 0x62, 'Numpad3': 0x63, 'Numpad4': 0x64,
    'Numpad5': 0x65, 'Numpad6': 0x66, 'Numpad7': 0x67, 'Numpad8': 0x68, 'Numpad9': 0x69,
    'NumpadAdd': 0x6B, 'NumpadSubtract': 0x6D, 'NumpadMultiply': 0x6A, 'NumpadDivide': 0x6F,
    'NumpadDecimal': 0x6E, 'NumpadEnter': 0x0D,
    'MouseLeft': 0x01,   // Left mouse button
    'MouseRight': 0x02,  // Right mouse button
    'MouseMiddle': 0x04, // Middle mouse button (wheel)
    'MouseButton4': 0x05, // X1 mouse button
    'MouseButton5': 0x06  // X2 mouse button
};

const vkToKeyMap: { [vk: number]: string } = Object.fromEntries(
    Object.entries(keyToVKMap).map(([key, value]) => [value, key])
);

export const keyToVK = (key: string): number => {
    return keyToVKMap[key] ?? null;
};

export const vkToKey = (vk: number): string => {
    return vkToKeyMap[vk] ?? null;
};
