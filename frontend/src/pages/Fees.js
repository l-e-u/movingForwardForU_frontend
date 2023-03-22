import { useEffect, useState } from 'react';

// components
import ActionButton from '../components/ActionButton.js';
import Card from '../components/Card.js';
import CreateFeeForm from '../components/CreateFeeForm.js';
import CreatedInfo from '../components/CreatedInfo.js';
import DeleteConfirmation from '../components/DeleteConfirmation.js';
import EditFeeForm from '../components/EditFeeForm.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import OptionsMenu from '../components/OptionsMenu.js';
import PageContentWrapper from '../components/PageContentWrapper.js';
import SmallHeader from '../components/SmallHeader.js';

// hooks
import { useFeesContext } from '../hooks/useFeesContext';
import { useAuthContext } from '../hooks/useAuthContext';

// functions
import { formatCurrency } from '../utils/StringUtils.js';

const Fees = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFeeId, setSelectedFeeId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

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

    // sets all the forms and menus show setters to false
    const hideAllMenusAndForms = () => [setShowEditForm, setShowCreateForm, setShowOptionsMenu, setShowDeleteConfirmation].forEach(setShow => setShow(false));

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                {showCreateForm ?
                    <CreateFeeForm setShowThisForm={setShowCreateForm} /> :
                    <ActionButton
                        alignX='right'
                        handleOnClick={() => {
                            hideAllMenusAndForms();
                            setShowCreateForm(true);
                            setSelectedFeeId(null);
                        }}
                        text='Create a Fee'
                    />
                }
            </div>

            {/* show spinner with actively fetching data */}
            {isLoading && <div className='my-5'><LoadingDocuments /></div>}

            {error && <ErrorLoadingDocuments docType='Fees' />}

            {fees &&
                <FlexBoxWrapper>
                    {fees.map(fee => {
                        const { _id } = fee;
                        const isSelectedFee = selectedFeeId === _id;

                        switch (true) {
                            case (showEditForm && isSelectedFee):
                                return (<div className='position-relative' key={_id}>
                                    <EditFeeForm prev={fee} setShowThisForm={setShowEditForm} />
                                </div>);

                            case (showDeleteConfirmation && isSelectedFee):
                                return (<div className='position-relative' key={_id}>
                                    <DeleteConfirmation
                                        dispatch={dispatch}
                                        doc_id={_id}
                                        model='FEE'
                                        checkReference='fees'
                                        route='fees'
                                        setShowThisForm={setShowDeleteConfirmation}
                                    />
                                </div>);

                            default:
                                return (<div className='position-relative' key={_id}>
                                    <OptionsMenu
                                        showMenu={showOptionsMenu && isSelectedFee}
                                        handleOnClickCloseMenu={() => setShowOptionsMenu(false)}
                                        handleOnClickDeleteOption={() => {
                                            hideAllMenusAndForms();
                                            setShowDeleteConfirmation(true);
                                        }}
                                        handleOnClickEditOption={() => {
                                            hideAllMenusAndForms();
                                            setShowEditForm(true);
                                        }}
                                        handleOnClickMenu={() => {
                                            hideAllMenusAndForms();
                                            setSelectedFeeId(_id);
                                            setShowOptionsMenu(true);
                                        }}
                                    />
                                    <Card
                                        header={<div>{fee.name}</div>}
                                        body={
                                            <div>
                                                <SmallHeader text='Amount' />
                                                <p className='mb-2'>{'$ ' + formatCurrency(fee.amount, true)}</p>
                                                <SmallHeader text='Description' />
                                                <p style={{ whiteSpace: 'pre-wrap' }}>{fee.description}</p>
                                            </div>
                                        }
                                        footer={<CreatedInfo createdAt={fee.createdAt} createdBy={fee.createdBy} />}
                                    />

                                </div>)
                        }
                    })
                    }
                </FlexBoxWrapper>
            }
        </PageContentWrapper>
    );
};

export default Fees;