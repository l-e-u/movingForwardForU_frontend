import { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useContactsContext } from '../hooks/useContactsContext.js'
import ContactDetails from '../components/ContactDetails.js';

const Contacts = () => {
  const { contacts, dispatch } = useContactsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch('http://localhost:4000/api/contacts', {
        headers: {
          'Authentication': `Bearer ${user.token}`
        }
      });

      // expecting all the contacts
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_CONTACTS', payload: json });
      };
    };

    if (user) fetchContacts();
  }, [dispatch, user]);

  return (
    <div className="contacts">
      {contacts && contacts.map((contact) => {
        return <ContactDetails key={contact._id} contact={contact} />
      })}
    </div>
  );
};

export default Contacts;