const ContactDetails = ({ contact }) => {
  return (
    <div className="details shadow">
      <p><strong>Organization: </strong>{contact.organization}</p>
    </div>
  );
};

export default ContactDetails;