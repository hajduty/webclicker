import { useEffect, useState } from "react";
import { Refill } from "../../Models/Combat";
import { debounceConstructor } from "../../Utils/Debounce";
import { updateKey, updateKeyOnly } from "../../Utils/Requests";
import { Module } from "../Module"
import { Checkbox, Divider, Slider } from "@mui/material";
import { keyToVK, vkToKey } from "../../Utils/utils";
import { MuiColorInput } from "mui-color-input";

const debounce = debounceConstructor(50); ''

interface Props {
    config: any;
}

export const RefillForm: React.FC<Props> = ({config}) => {
    const [colorValue, setColorValue] = useState<string>('#ffffff')
    const [refill, setRefill] = useState<Refill>({
        refillBind: 0,
        refillDelay: 40,
        refillEnabled: false,
        fullscreenRefill: true,
        randomizePosition: false,
        selectColor: false,
        selectPosition: false,
        refillColor: "#ffffff"
    });

    const handleSliderChange = async (key: keyof Refill, value: number) => {
        await debounce(() => {
            setRefill({ ...refill, [key]: value });
            updateKey({ _value: value, _key: key });
        });

        setRefill({ ...refill, [key]: value })
    };

    const handleCheckboxChange = async (checked: boolean) => {
        setRefill({ ...refill, refillEnabled: checked });
        await debounce(() => {
            updateKey({ _key: "refillEnabled", _value: checked });
        });
    };

    const handleBooleanChangeClient = async (key: keyof Refill, value: boolean) => {
        setRefill({ ...refill, [key]: value });
        await debounce(() => {
            updateKeyOnly({ _key: key, _value: value });
        });
    };
    
    const handleBooleanChange = async (key: keyof Refill, value: boolean) => {
        setRefill({ ...refill, [key]: value });
        await debounce(() => {
            updateKey({ _key: key, _value: value });
        });
    };

    const [keybind, setKeybind] = useState<string>('');

    const handleKeyChange = async (key: string) => {
        setRefill({ ...refill, refillBind: keyToVK(key) });
        setKeybind(key);
        await debounce(() => {
            updateKey({ _key: "refillBind", _value: keyToVK(key) });
            //console.log(keyToVK(key));
        });
    };

    useEffect(() => {
        if (config == null) {
            return;
        }

        setRefill(prevState => ({
            ...prevState,
            ...config,
        }));

        refill.refillBind = refill.refillBind;

        const keyString = vkToKey(config.refillBind);
        if (keyString) {
            setKeybind(keyString);
        }

        if (config.refillColor) {
            setColorValue(config.refillColor);
        }
    }, [config]);

    const handleColor = async (newValue: string) => {
        setColorValue(newValue);
        await debounce(() => {
            setColorValue(newValue);
            updateKey({ _key: "refillColor", _value: newValue });
        });
    }

    return (
        <>
            <Module title="Refill" checked={refill.refillEnabled} onCheckedChange={handleCheckboxChange} selectedKey={keybind} onKeyChange={handleKeyChange}>
                <div className='flex flex-col justify-normal text-left text-white mx-8 space-y-2'>
                    <p>Delay</p>
                    <Slider
                        value={refill.refillDelay}
                        onChange={(_e, newValue) => handleSliderChange('refillDelay', newValue as number)}
                        aria-labelledby="refillDelay-slider"
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        min={1}
                        valueLabelFormat={value => <div>{value + " ms"}</div>}
                        max={100}
                    />
                    <div className="flex-row flex p-0 m-0 align-middle justify-between items-center">
                        <p>Fullscreen Mode</p>
                        <Checkbox className=""
                            checked={refill.fullscreenRefill}
                            onChange={(_e, newValue) => handleBooleanChange('fullscreenRefill', newValue as boolean)}
                            color="primary"
                        />
                    </div>
                    <div className="flex-row flex p-0 m-0 align-middle justify-between items-center">
                        <p>Randomize Pot Pick</p>
                        <Checkbox className=""
                            checked={refill.randomizePosition}
                            onChange={(_e, newValue) => handleBooleanChange('randomizePosition', newValue as boolean)}
                            color="primary"
                        />
                    </div>
                    <Divider></Divider>
                    <div className="flex-row flex p-0 m-0 align-middle justify-between items-center">
                        <p>Setup Color</p>
                        <Checkbox className=""
                            checked={refill.selectColor}
                            onChange={(_e, newValue) => handleBooleanChangeClient('selectColor', newValue as boolean)}
                            color="primary"
                        />
                    </div>
                    <div className="flex-row flex p-0 m-0 align-middle justify-between items-center">
                        <p>Setup Inventory Positions</p>
                        <Checkbox className=""
                            checked={refill.selectPosition}
                            onChange={(_e, newValue) => handleBooleanChangeClient('selectPosition', newValue as boolean)}
                            color="primary"
                        />
                    </div>
                    <div className="flex-row flex p-0 m-0 align-middle justify-between items-center">
                        <p>Refill Color</p>
                        <MuiColorInput format="hex" value={colorValue} onChange={handleColor} className="w-1/2 m-0 p-0" />
                    </div>
                </div>
            </Module>
        </>
    )
}