// context
import { useState } from 'react';
import { useCreateFee } from '../hooks/useCreateFee';

// components
import FeeForm from './FeeForm';
import FormHeader from './FormHeader';

const CreateFeeForm = ({ setShowThisForm }) => {
    const { createFee, error, isLoading } = useCreateFee();
    const [fee, setFee] = useState({
        amount: '',
        description: '',
        name: '',
    });

    return (
        <div className='shadow'>
            <FormHeader text='New Fee' handleCloseForm={() => setShowThisForm(false)} />

            <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
                <FeeForm
                    {...fee}
                    error={error}
                    handleSubmit={async () => {
                        await createFee({
                            ...fee,
                            amount: Number(fee.amount.replace(/,/g, ''))
                        })
                            .then(isCreated => {
                                if (isCreated) setShowThisForm(false);
                            });
                    }}
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    setFee={setFee}
                />
            </div>
        </div>
    );
};

export default CreateFeeForm;