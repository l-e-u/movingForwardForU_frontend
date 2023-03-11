// context
import { useState } from 'react';
import { useCreateFee } from '../hooks/useCreateFee';

// components
import FeeForm from './FeeForm';
import FormHeader from './FormHeader';
import CloseFormButton from './XButton';

const CreateFeeForm = ({ setShowThisForm }) => {
    const { createFee, error, isLoading } = useCreateFee();
    const [fee, setFee] = useState({
        amount: '',
        description: '',
        name: '',
    });

    return (
        <>
            <FormHeader text='New Fee'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

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
        </>
    );
};

export default CreateFeeForm;