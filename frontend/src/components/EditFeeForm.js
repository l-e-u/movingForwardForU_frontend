// hooks
import { useState } from 'react';

// hooks
import { useUpdateFee } from '../hooks/useUpdateFee.js';

// functions
import { formatCurrency, noCharChanges } from '../utils/StringUtils';

// components
import FeeForm from './FeeForm';
import FormHeader from './FormHeader'

const EditFeeForm = ({ prev, setShowThisForm }) => {
    const { updateFee, error, isLoading } = useUpdateFee();
    const [fee, setFee] = useState(prev);
    const updatedProperties = {};

    console.log('prev:', formatCurrency(prev.amount));
    console.log('curr:', formatCurrency(fee.amount))

    // check if any property values have changed
    if (!noCharChanges(prev.name, fee.name)) updatedProperties.name = fee.name;
    if (formatCurrency(prev.amount) !== formatCurrency(fee.amount)) updatedProperties.amount = Number(fee.amount);
    if (prev.description !== fee.description) updatedProperties.description = fee.description;

    // check if there were any set properties that have been changed
    const noInputChanges = Object.keys(updatedProperties).length === 0;

    console.log(updatedProperties)
    console.log(noInputChanges)

    return (
        <div className='shadow'>
            <FormHeader text='Edit Fee' handleCloseForm={() => setShowThisForm(false)} />

            <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
                <FeeForm
                    {...fee}
                    error={error}
                    handleSubmit={async () => {
                        await updateFee({
                            _id: prev._id,
                            fee: { ...updatedProperties }
                        })
                            .then(wasUpdated => {
                                if (wasUpdated) setShowThisForm(false);
                            })
                    }}
                    isDisabled={isLoading || noInputChanges}
                    isLoading={isLoading}
                    setFee={setFee}
                />
            </div>
        </div>
    );
};

export default EditFeeForm;