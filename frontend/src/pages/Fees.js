// components
import { useEffect, useState } from 'react';

// components
import PageContentWrapper from '../components/PageContentWrapper.js'
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';
import CardContainer from '../components/CardContainer.js';
import CreatedInfo from '../components/CreatedInfo.js';
import ShowCreateFormButton from '../components/ShowCreateFormButton.js';
import CreateFeeForm from '../components/CreateFeeForm.js';
import FeeOverview from '../components/FeeOverview.js';

// hooks
import { useFeesContext } from '../hooks/useFeesContext';
import { useAuthContext } from '../hooks/useAuthContext';

const Fees = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const { user } = useAuthContext();
    const { fees, dispatch } = useFeesContext();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/fees', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all fees
            const json = await response.json();

            if (!response.ok) {
                console.error(json);
                setError(json.error);
                setIsLoading(false);
            };

            if (response.ok) {
                setError(null);
                setIsLoading(false);
                dispatch({ type: 'SET_FEES', payload: json });
            };
        })();
    }, []);

    if (error) {

    };

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                {showCreateForm ?
                    <CreateFeeForm setShowThisForm={setShowCreateForm} /> :
                    <ShowCreateFormButton text='Create a Fee' handleOnClick={() => {
                        setShowCreateForm(true);
                        setShowEditForm(false);
                    }}
                    />
                }
            </div>
            {/* show spinner with actively fetching data */}
            {isLoading && <LoadingDocuments />}
            {error && <ErrorLoadingDocuments docType='Fees' />}
            <FlexBoxWrapper>
                {fees &&
                    fees.map(fee => {
                        const { _id, createdAt, createdBy } = fee;

                        return (
                            <CardContainer key={_id} hasCreatedInfo={true}>
                                <FeeOverview {...fee} />
                                <CreatedInfo createdAt={createdAt} createdBy={createdBy} />
                            </CardContainer>
                        );
                    })
                }
            </FlexBoxWrapper>
        </PageContentWrapper>
    );
};

export default Fees;