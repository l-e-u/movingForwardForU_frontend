import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useContactsContext } from '../hooks/useContactsContext.js'

// components
import OverviewContainer from '../components/OverviewContainer.js'
import CreateContactForm from '../components/CreateContactForm.js';
import CreatedInfo from '../components/CreatedInfo.js';
import DeleteDocIcon from "../components/DeleteDocIcon.js";
import EditDocIcon from "../components/EditDocIcon.js";
import EditContactForm from '../components/EditContactForm.js';
import ContactOverview from '../components/ContactOverview.js';

const Contacts = () => {
  const { contacts, dispatch } = useContactsContext();
  const { user } = useAuthContext();

  console.log(contacts)

  // local state
  const [docToEdit, setDocToEdit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch('/api/contacts', {
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

  // deletes contact by _id
  const deleteById = async (_id) => {
    const response = await fetch('/api/contacts/' + _id, {
      method: 'DELETE',
      headers: {
        'Authentication': `Bearer ${user.token}`
      }
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_CONTACT', payload: json })
    };
  };

  // function closure returns a func that sets the contact to be edited, hides the CreateStatusForm and shows EditStatusForm
  const handleEditClick = (contact) => {
    return () => {
      setDocToEdit(contact);
      setShowCreateForm(false);
      setShowEditForm(true);
    };
  };

  return (
    <div className="contacts">
      {showCreateForm && <CreateContactForm isShowing={showCreateForm} setShow={setShowCreateForm} />}

      {!showCreateForm &&
        <button
          type='button'
          className={'rounded-pill btn btn-primary btn-sm px-3 d-block mx-auto'}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          + New Contact
        </button>
      }
      {contacts && contacts.map((contact) => {
        const { _id, address, billingAddress, email, phoneNumber, phoneExt, name, organization, createdBy, note, createdAt } = contact;
        const isEditingThisDoc = showEditForm && (_id === docToEdit._id);

        return (
          <div key={_id} className='my-4'>
            <OverviewContainer>
              {/* Edit and Delete options */}
              <div className="position-absolute top-0 end-0 pe-3 pt-2 d-flex">
                {!isEditingThisDoc && <EditDocIcon onClick={handleEditClick(contact)} />}
                <div className="ps-5">

                  <DeleteDocIcon onClick={() => deleteById(_id)} />
                </div>
              </div>

              {isEditingThisDoc ?
                <EditContactForm
                  setShowThisForm={setShowEditForm}
                  _id={_id}
                  address={address}
                  billingAddress={billingAddress}
                  email={email}
                  phoneNumber={phoneNumber}
                  phoneExt={phoneExt}
                  name={name}
                  organization={organization}
                  note={note} /> :
                <ContactOverview {...contact} />}
            </OverviewContainer>
            <div className="mt-1 pe-2">
              <CreatedInfo createdBy={createdBy} createdAt={createdAt} />
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default Contacts;