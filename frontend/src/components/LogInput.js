// components
import { useState } from 'react';
import NoteInput from './NoteInput';
import SmallHeader from './SmallHeader';
import XButton from './XButton';

// list inputs that user can log notes, each handle their own errors and can individually removed
const LogInput = ({ logs, setJob, error, setError }) => {
    // return null if there's no notes to show
    if (logs.length === 0) return null;

    return (
        <>
            <SmallHeader text='Logs' />
            <ul className='list-group mt-2 gap-2'>
                {logs.map((log, index) => {
                    const { _id } = log;
                    const errorProperty = `logs.${index}.note`;
                    const inputError = error?.[errorProperty];
                    return (
                        <li key={_id || index}>
                            <div className='input-group'>
                                <NoteInput
                                    input={log.note}
                                    error={inputError}
                                    handleOnChange={e => {
                                        // make a copy of the logs
                                        const updatedLogs = [...logs];

                                        // save user input only to the note being changed
                                        updatedLogs[index] = {
                                            ...updatedLogs[index],
                                            note: e.target.value
                                        };

                                        // send back the updated version on the log
                                        setJob(prev => {
                                            return ({
                                                ...prev,
                                                logs: updatedLogs
                                            })
                                        })
                                    }} />

                                <span className='input-group-text p-0'>
                                    <XButton handleOnClick={() => {
                                        if (inputError) {
                                            setError(prev => {
                                                const updatedErrors = { ...prev };
                                                delete updatedErrors[errorProperty];

                                                return updatedErrors;
                                            })
                                        }
                                        setJob(prev => {
                                            return {
                                                ...prev,
                                                logs: prev.logs.filter((l, i) => {
                                                    if (_id) return l._id !== _id;
                                                    return i !== index;
                                                })
                                            }
                                        })
                                    }} />
                                </span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    );

};

export default LogInput;