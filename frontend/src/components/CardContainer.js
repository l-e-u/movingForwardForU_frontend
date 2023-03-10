const CardContainer = ({ children, hasCreatedInfo = false }) => {
    // add extra padding at the bottom of the card for created info, only admins can see the created info
    const padding = hasCreatedInfo ? 'pt-4 px-4 pb-5' : 'p-4';

    return (
        <div className={'shadow-sm theme-light rounded-2 position-relative flex-grow-1 ' + padding}>
            {children}
        </div>
    );
};

export default CardContainer;