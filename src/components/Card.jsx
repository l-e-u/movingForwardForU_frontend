import { CSSTransition } from 'react-transition-group';

const Card = ({ header, body, footer = null }) => {
    return (
        <CSSTransition
            appear={true}
            classNames='fade-'
            in={true}
            timeout={500}
        >
            <div className='shadow d-md-flex'>
                <div
                    className='background-navy text-white p-3 rounded-top rounded-md-top-end-0 rounded-md-bottom-start'
                    style={{ flex: '0 0 200px' }}
                >
                    {header}
                </div>
                <div
                    className='background-white flex-grow-1 p-3 rounded-bottom rounded-md-bottom-start-0 rounded-md-top-end'
                    style={{ flex: '1 1 0px' }}
                >
                    {body}

                    {footer && <div className='text-end position-relative' style={{ top: '.75rem', right: '.25rem' }}>
                        {footer}
                    </div>}
                </div>
            </div>
        </CSSTransition>
    );
};

export default Card;