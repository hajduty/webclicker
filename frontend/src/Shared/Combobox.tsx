import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

interface BooleanMultiComboboxProps {
    values: { [key: string]: boolean };
    onChange: (key: string, value: boolean) => void;
}

const BooleanMultiCombobox: React.FC<BooleanMultiComboboxProps> = ({ values, onChange }) => {
    const handleToggle = (key: string) => {
        onChange(key, !values[key]); // Toggle the boolean value
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="boolean-multi-combobox-label">Conditions</InputLabel>
            <Select
                labelId="boolean-multi-combobox-label"
                id="boolean-multi-combobox"
                size="medium"
                multiple
                value={Object.keys(values).filter((key) => values[key])}
                renderValue={(selected) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(selected as string[]).map((value) => (
                            <MenuItem key={value} value={value}>
                                {value}
                            </MenuItem>
                        ))}
                    </div>
                )}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 224,
                        },
                    },
                }}
            >
                {Object.keys(values).map((key) => (
                    <MenuItem key={key} value={key} onClick={() => handleToggle(key)}>
                        {key}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default BooleanMultiCombobox;