import React, { useEffect, useState } from 'react';
import { Module } from '../Module';
import { Button, TextField } from '@mui/material';
import { debounceConstructor } from '../../Utils/Debounce';
import { useAuth } from '../../Auth/AuthContext';
import { setConfig } from '../../Utils/Requests';

const debounce = debounceConstructor(200);

export const ConfigForm: React.FC = () => {
    const { loading } = useAuth();
    const [text, setText] = useState<string>("");

    useEffect(() => {
        // Function to fetch users
        if (loading) {
            return;
        }
    }, [loading]);

    const onTextfield = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }

    const destroyClient = async () => {
        debounce(() => {
            setConfig(text);
        });
    }

    return (
        <Module title="Config" onKeyChange={() => {  }} >
            <div className='flex flex-col justify-normal text-left text-white mx-8 space-y-2'>
                <TextField id="outlined-basic" label="Paste in config" variant="filled" onChange={onTextfield} />
                <Button onClick={destroyClient}>Paste </Button>
            </div>
        </Module>
    );
};