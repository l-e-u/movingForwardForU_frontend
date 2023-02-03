const UserDetails = ({ user }) => {
    return (
        <div className='details shadow'   >
            <p><strong>Username: </strong>{user.username}</p>
        </div>
    );
};

export default UserDetails;