// components
import RequiredFieldsText from './RequiredFieldsText';
import GrowingTextArea from './GrowingTextArea';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

const StatusForm = ({ status, setStatus, handleSubmit, error, isDisabled }) => {
    const { name, description } = status;

    // error identification
    const errorFromNameInput = error?.name;
    const errorFromDescriptionInput = error?.description;
    const errorOther = error?.server;

    return (
        <form onSubmit={handleSubmit}>
            <RequiredFieldsText />

            <div className='form-floating mb-3'>
                <input
                    type='text'
                    className={'form-control' + (errorFromNameInput ? ' is-invalid' : '')}
                    name='name'
                    placeholder='Name'
                    id='name'
                    onChange={(e) => {
                        setStatus(prev => {
                            return {
                                ...prev,
                                name: removeExtraSpaces(e.target.value)
                            }
                        })
                    }}
                    onBlur={(e) => {
                        setStatus(prev => {
                            return {
                                ...prev,
                                name: e.target.value.trim()
                            }
                        })
                    }}
                    value={name} />
                <label htmlFor='name' className='form-label required'>
                    Name
                    {errorFromNameInput && <span className='ms-1 text-danger'>{': ' + error.name.message}</span>}
                </label>
            </div>

            <div className='form-floating mb-3'>
                <GrowingTextArea
                    className={'form-control' + (errorFromDescriptionInput ? ' is-invalid' : '')}
                    name='description'
                    onBlur={(e) => {
                        setStatus(prev => {
                            return {
                                ...prev,
                                description: e.target.value.trim()
                            }
                        })
                    }}
                    onChange={(e) => {
                        setStatus(prev => {
                            return {
                                ...prev,
                                description: e.target.value
                            }
                        })
                    }}
                    placeholder='Description'
                    value={description}
                />
                <label htmlFor='description' className='form-label required'>
                    Description
                    {errorFromDescriptionInput && <span className='ms-1 text-danger'>{': ' + error.description.message}</span>}</label>
            </div>

            <button
                type='submit'
                disabled={isDisabled}
                className='btn btn-sm btn-success rounded-pill px-3 d-flex ms-auto'>
                Save
            </button>

            {/* any errors other than name and description input validation */}
            {errorOther && <div className="text-danger mt-3">{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    );
};

export default StatusForm;