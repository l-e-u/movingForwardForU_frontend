import { useState } from 'react';

// components
import CollapsingSection from './CollapsingSection';
import DetailsContainer from './DetailsContainer';
import EllipsisMenu from './EllipsisMenu';
import SmallHeader from './SmallHeader';
import Tabs from './Tabs';

// utilities
import { formatCurrency, phoneNumberFormatted } from '../utils/StringUtils';

const ContactDetails = ({ contact, showEditForm }) => {
   const [showMore, setShowMore] = useState(false);

   const {
      address,
      billingAddress,
      defaultFees,
      email,
      note,
      organization,
      phoneExt,
      phoneNumber
   } = contact;

   return (
      <DetailsContainer>
         <EllipsisMenu
            actions={[
               {
                  name: showMore ? 'Collapse' : 'Expand',
                  icon: `bi bi-chevron-${showMore ? 'contract' : 'expand'}`,
                  handler: () => setShowMore(!showMore)
               }
            ]}
         />

         {/* organization/business name display */}
         <div className='mb-2' style={{ fontWeight: '600' }}>{organization}</div>

         {/* DEFAULT VIEW FOR QUICK READING */}
         {/* address, phone, and email, this layout will flex depending on the screen size */}
         <div className='row px-1 px-sm-3 px-md-4 px-lg-1'>
            <div className='address col-lg d-flex gap-2 justify-content-lg-center mb-1 mb-lg-0'>
               <i className='bi bi-geo-alt text-secondary fs-smaller'></i>
               <div>{address}</div>
            </div>

            <div className='phone col-lg d-flex gap-2 justify-content-lg-center mb-1 mb-lg-0'>
               <i className='bi bi-telephone text-secondary fs-smaller'></i>
               <div>
                  {`${phoneNumberFormatted(phoneNumber)}${phoneExt ? ' x' + phoneExt : ''}`}
               </div>
            </div>

            <div className='email col-lg d-flex gap-2 justify-content-lg-center'>
               <i className='bi bi-envelope-at text-secondary fs-smaller'></i>
               <div className='word-break-all'>{email}</div>
            </div>
         </div>

         <CollapsingSection maxHeight='300px' isExpanded={showMore}>
            <Tabs
               tabs={[
                  {
                     name: 'Note',
                     icon: 'bi bi-sticky',
                     contentJSX: <p className='whiteSpace-preWrap m-0'>{note}</p>
                  }
               ]}
            />
         </CollapsingSection>
      </DetailsContainer>
   );
};

export default ContactDetails;