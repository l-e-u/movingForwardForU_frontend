import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useContactsContext } from '../hooks/useContactsContext.js'

// components
import CardContainer from '../components/CardContainer.js'
import CreateContactForm from '../components/CreateContactForm.js';
import CreatedInfo from '../components/CreatedInfo.js';
import DeleteDocIcon from '../components/DeleteDocIcon.js';
import EditDocIcon from '../components/EditDocIcon.js';
import EditContactForm from '../components/EditContactForm.js';
import ContactOverview from '../components/ContactOverview.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import PageContentWrapper from '../components/PageContentWrapper.js';

const Contacts = () => {
  const { contacts, dispatch } = useContactsContext();
  const { user } = useAuthContext();

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
    <PageContentWrapper>
      <div className="mb-3">
        {showCreateForm ?
          <CreateContactForm setShowThisForm={setShowCreateForm} /> :
          <button
            type='button'
            className={'rounded-pill btn btn-primary btn-sm px-3 d-block mx-auto'}
            onClick={() => setShowCreateForm(true)}>
            Create A Contact
          </button>
        }
      </div>

      <FlexBoxWrapper>
        {contacts && contacts.map((contact) => {
          const { _id, createdBy, createdAt } = contact;
          const isEditingThisDoc = showEditForm && (_id === docToEdit._id);
          const editFormProps = {
            prevContact: contact,
            setShowThisForm: setShowEditForm
          };

          return (
            <CardContainer key={_id} hasCreatedInfo={true}>
              {/* Edit and Delete options */}
              <div className='position-absolute top-0 end-0 pe-3 pt-2 d-flex'>
                {!isEditingThisDoc && <EditDocIcon onClick={handleEditClick(contact)} />}
                <div className='ps-5'>

                  <DeleteDocIcon onClick={() => deleteById(_id)} />
                </div>
              </div>

              {isEditingThisDoc ?
                <EditContactForm {...editFormProps} /> :
                <ContactOverview {...contact} />
              }
              <CreatedInfo createdBy={createdBy} createdAt={createdAt} />
            </CardContainer>
          );
        })}
      </FlexBoxWrapper>
    </PageContentWrapper>
  );
};

export default Contacts;