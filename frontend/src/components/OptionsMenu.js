import { CSSTransition } from 'react-transition-group';

// components
import XButton from './XButton';

const OptionsMenu = ({
    showMenu,
    handleOnClickMenu,
    handleOnClickCloseMenu,
    handleOnClickArchiveOption,
    handleOnClickDeleteOption,
    handleOnClickEditOption
}) => {
    return (<>
        <button
            className='border-0 text-action position-absolute top-0 end-0 p-3'
            onClick={handleOnClickMenu} style={{ backgroundColor: 'transparent' }}
            type='button'
        >
            <i className='bi bi-three-dots-vertical'></i>
        </button>


        {showMenu &&
            <CSSTransition
                appear={true}
                classNames='fade-'
                in={showMenu}
                timeout={500}
            >
                <div
                    className='position-absolute text-action background-white rounded shadow pb-3'
                    style={{ zIndex: '50', top: '1rem', right: '1rem' }}
                >
                    <div className='text-end'>
                        <XButton handleOnClick={handleOnClickCloseMenu} />
                    </div>
                    {handleOnClickEditOption &&
                        <button
                            className='border-0 text-reset py-2 ps-4 pe-5'
                            onClick={handleOnClickEditOption}
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <i className='bi bi-pencil me-4'></i>
                            Edit
                        </button>
                    }

                    {handleOnClickDeleteOption && <>
                        <br /><br />
                        <button
                            className='border-0 text-reset py-2 ps-4 pe-5'
                            onClick={handleOnClickDeleteOption}
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <i className='bi bi-trash3 me-4'></i>
                            Delete
                        </button>
                    </>}

                    {handleOnClickArchiveOption && <>
                        <br /><br />
                        <button
                            className='border-0 text-reset py-2 ps-4 pe-5'
                            onClick={handleOnClickArchiveOption}
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <i className='bi bi-archive me-4'></i>
                            Archive
                        </button>
                    </>}
                </div>
            </CSSTransition>
        }
    </>);
};

export default OptionsMenu;