import React, { useEffect, useState } from 'react';
import { Module } from '../Module';
import { Button, TextField } from '@mui/material';
import { Destruct } from '../../Models/Combat';
import { debounceConstructor } from '../../Utils/Debounce';
import { getConfig, updateKey, updateKeyOnly } from '../../Utils/Requests';
import { useAuth } from '../../Auth/AuthContext';

const debounce = debounceConstructor(200);

export const DestructForm: React.FC = () => {
    const {loading} = useAuth();
    const [destruct, setDestruct] = useState<Destruct>({
        filename: "filename.dll",
    });

    useEffect(() => {
        if (loading) {
            return;
        }

        const fetchUsers = async () => {
            const data = await getConfig();
            setDestruct(data);
        };

        fetchUsers();
    }, [loading]);

    const onTextfield = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setDestruct({ filename: event.target.value });
        await debounce(() => {
            updateKey({ _key: "filename", _value: event.target.value });
        });
    }

    const destroyClient = async () => {
        await debounce(() => {
            updateKeyOnly({ _key: "destruct", _value: "can be anything" });
        });
    }

    return (
        <Module title="Destruct" onKeyChange={() => { console.log("hello"); }} >
            <div className='flex flex-col justify-normal text-left text-white mx-8 space-y-2'>
                <TextField id="outlined-basic" label="Filename" variant="filled" value={destruct.filename} onChange={onTextfield}/>
                <Button onClick={destroyClient}>Destruct </Button>
            </div>
        </Module>
    );
};