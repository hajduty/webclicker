import React, { useEffect, useState } from 'react';
import { Module } from '../Module';
import { Slider } from '@mui/material';
import BooleanMultiCombobox from '../Combobox';
import { Leftclicker } from '../../Models/Combat';
import { debounceConstructor } from '../../Utils/Debounce';
import { updateKey } from '../../Utils/Requests';
import { keyToVK, valueFormatter, vkToKey } from '../../Utils/utils';

const debounce = debounceConstructor(200);

interface Props {
    config: any;
}

export const LeftclickerForm: React.FC<Props> = ({config}) => {
    const [leftclicker, setLeftclicker] = useState<Leftclicker>({
        leftclickerBind: 0,
        leftclickerCps: 12,
        leftJitter: 0,
        leftclickerEnabled: true,
        blockhitChance: 0,
        breakBlocks: false,
        clickInMenu: false,
        lockLeft: false,
        onlyClickIngame: false,
        shiftDisable: false
    });

    const handleSliderChange = async (key: keyof Leftclicker, value: number) => {
        await debounce(() => {
            setLeftclicker({ ...leftclicker, [key]: value });
            updateKey({_value: value, _key: key});
            //console.log(key,value);
        });

        setLeftclicker({ ...leftclicker, [key]: value })
    };

    const handleCheckboxChange = async (checked: boolean) => {
        setLeftclicker({ ...leftclicker, leftclickerEnabled: checked });
        await debounce(() => {
            updateKey({ _key: "leftclickerEnabled", _value: checked });
        });
    };

    const handleBooleanChange = async (key: keyof Leftclicker, value: boolean) => {
        setLeftclicker({ ...leftclicker, [key]: value });
        await debounce(() => {
            updateKey({ _key: key, _value: value });
        });
        //console.log(key,value);
    };

    const [keybind, setKeybind] = useState<string>('');

    const handleKeyChange = async (key: string) => {
        setLeftclicker({ ...leftclicker, leftclickerBind: keyToVK(key) });
        setKeybind(key);
        await debounce(() => {
            updateKey({ _key: "leftclickerBind", _value: keyToVK(key) });
            //console.log(keyToVK(key));
        });
    };

    useEffect(() => {
        if (config == null) {
            return;
        }

        setLeftclicker(prevState => ({
            ...prevState,
            ...config,
        }));

        leftclicker.leftclickerBind = config.leftclickerBind;

        const keyString = vkToKey(config.leftclickerBind);
        if (keyString) {
            setKeybind(keyString);
        }
    }, [config]);


    return (
        <Module title="Leftclicker" checked={leftclicker.leftclickerEnabled} onCheckedChange={handleCheckboxChange} selectedKey={keybind} onKeyChange={handleKeyChange}>

            <div className='flex flex-col justify-normal text-left text-white mx-8 space-y-2'>
                <p>CPS</p>
                <Slider
                    value={leftclicker.leftclickerCps}
                    onChange={(_e, newValue) => handleSliderChange('leftclickerCps', newValue as number)}
                    aria-labelledby="leftcps-slider"
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    step={1}
                    valueLabelFormat={value => <div>{value+" CPS"}</div>}
                    marks
                    min={1}
                    max={20}
                />
                <p>Blockhit</p>
                <Slider
                    value={leftclicker.blockhitChance}
                    onChange={(_e, newValue) => handleSliderChange('blockhitChance', newValue as number)}
                    aria-labelledby="blockhit-slider"
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => <div>{value+"%"}</div>}
                    step={1}
                    min={0}
                    max={100}
                />
                <p>Jitter</p>
                <Slider
                    value={leftclicker.leftJitter}
                    onChange={(_e, newValue) => handleSliderChange('leftJitter', newValue as number)}
                    aria-labelledby="jitter-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    valueLabelFormat={value => <div>{valueFormatter(value, 1)+"px"}</div>}
                    min={0}
                    max={40}
                />
                <BooleanMultiCombobox
                    values={{
                        clickInMenu: leftclicker.clickInMenu,
                        shiftDisable: leftclicker.shiftDisable,
                        breakBlocks: leftclicker.breakBlocks,
                        lockLeft: leftclicker.lockLeft,
                        onlyClickIngame: leftclicker.onlyClickIngame,
                    }}
                    onChange={(key, value) => handleBooleanChange(key as keyof Leftclicker, value)}
                />
            </div>
        </Module>
    );
};