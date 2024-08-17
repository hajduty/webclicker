import React, { } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Accordion, AccordionDetails, AccordionSummary, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { keyboardKeys } from '../Utils/utils';

interface Props {
    width?: string;
    height?: string;
    title: string;
    className?: string;
    children: React.ReactNode;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    selectedKey?: string;
    onKeyChange: (key: string) => void;
}

export const Module: React.FC<Props> = ({ width = 'w-96', title, children, checked = false, onCheckedChange, selectedKey = '', onKeyChange }) => {
    const handleKeyChange = (event: SelectChangeEvent) => {
        onKeyChange(event.target.value as string);
    };

    return (
        <div className={`${width}`}>
            <Accordion className="mb-4 rounded-md border-transparent border-1" >
                <AccordionSummary className=' flex items-center py-1 px-5 justify-between'
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                        backgroundColor: "#0a0a0a"
                    }}
                >
                    <div className="flex items-center py-1 px-5 justify-between grow bg-[#0a0a0a]">
                        <p className="text-[#ACACAC] text-lg text-left">{title}</p>
                        {onCheckedChange != null &&
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(e) => onCheckedChange(e.target.checked)}
                                        color="success"
                                    />
                                }
                                label={<h1 className="text-[#950000] text-lg text-left">{ }</h1>}
                                labelPlacement="start"
                                className="text-white"
                            />
                        }
                    </div>
                </AccordionSummary>
                <AccordionDetails className='bg-[#0a0a0a]'>
                    <>
                        {children}
                    </>
                    <Divider className="pt-4"/> 
                    <div className="pt-4 flex justify-center">
                        {onCheckedChange != null &&
                            <FormControl>
                                <InputLabel>Keybind</InputLabel>
                                <Select
                                    labelId="boolean-combobox-label-chip"
                                    id="boolean-combobox-chip"
                                    value={selectedKey}
                                    onChange={handleKeyChange}
                                    className='w-52'
                                >
                                    {keyboardKeys.map((key) => (
                                        <MenuItem key={key} value={key}>
                                            {key}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};