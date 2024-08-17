import { useEffect, useState } from "react";
import { Rightclicker } from "../../Models/Combat";
import { debounceConstructor } from "../../Utils/Debounce";
import { updateKey } from "../../Utils/Requests";
import { Module } from "../Module"
import { Slider } from "@mui/material";
import { keyToVK, valueFormatter, vkToKey } from "../../Utils/utils";

const debounce = debounceConstructor(200); ''
interface Props {
    config: any;
}

export const RightclickerForm: React.FC<Props> = ({config}) => {
    const [rightclicker, setRightclicker] = useState<Rightclicker>({
        rightclickerBind: 0,
        rightclickerEnabled: false,
        allowEat: false,
        rightclickerCps: 20,
        rightJitter: 0,
    });

    const handleSliderChange = async (key: keyof Rightclicker, value: number) => {
        await debounce(() => {
            setRightclicker({ ...rightclicker, [key]: value });
            updateKey({ _value: value, _key: key });
        });

        setRightclicker({ ...rightclicker, [key]: value })
    };

    const handleCheckboxChange = async (checked: boolean) => {
        setRightclicker({ ...rightclicker, rightclickerEnabled: checked });
        await debounce(() => {
            updateKey({ _key: "rightclickerEnabled", _value: checked });
        });
    };

    const [keybind, setKeybind] = useState<string>('');

    const handleKeyChange = async (key: string) => {
        setKeybind(key);
        setRightclicker({ ...rightclicker, rightclickerBind: keyToVK(key) });
        await debounce(() => {
            updateKey({ _key: "rightclickerBind", _value: keyToVK(key) });
            //console.log(keyToVK(key));
        });
    };

    useEffect(() => {
        if (config == null) {
            return;
        }

        setRightclicker(prevState => ({
            ...prevState,
            ...config,
        }));

        rightclicker.rightclickerBind = config.rightclickerBind;

        const keyString = vkToKey(config.rightclickerBind);
        if (keyString) {
            setKeybind(keyString);
        }
    }, [config]);

    return (
        <>
            <Module title="Rightclicker" checked={rightclicker.rightclickerEnabled} onCheckedChange={handleCheckboxChange} selectedKey={keybind} onKeyChange={handleKeyChange}>
                <div className='flex flex-col justify-normal text-left text-white mx-8 space-y-2'>
                    <p>CPS</p>
                    <Slider
                        value={rightclicker.rightclickerCps}
                        onChange={(_e, newValue) => handleSliderChange('rightclickerCps', newValue as number)}
                        aria-labelledby="rightCps-slider"
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        min={1}
                        valueLabelFormat={value => <div>{value+" CPS"}</div>}
                        max={100}
                    />
                    <p>Jitter</p>
                    <Slider
                        value={rightclicker.rightJitter}
                        onChange={(_e, newValue) => handleSliderChange('rightJitter', newValue as number)}
                        aria-labelledby="rightJitter-slider"
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        valueLabelFormat={value => <div>{valueFormatter(value, 1)+"px"}</div>}
                        min={0}
                        max={40}
                    />
                </div>
            </Module>
        </>
    )
}