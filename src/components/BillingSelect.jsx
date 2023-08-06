import { motion } from 'framer-motion';

const BillingSelect = ({ defaultFees }) => {
   // as the user selects fees, the list gets populated
   const defaultFeesListClasses = 'defaultFeesList rounded m-0 p-0 fs-smaller';
   const defaultFeesListStyles = { listStyle: 'none' };

   // items have the option to clear it off the default-selection list
   const defaultFeesItemClasses = 'd-flex align-items-center rounded-pill mb-2';
   const defaultFeesItemStyles = {
      border: '1px solid var(--mainPalette4)',
      color: 'var(--mainPalette3)'
   };

   const handleRemoveDefaultFee = (_id) => {
      return () => {
         setContact({
            ...contact,
            defaultFees: defaultFees.filter(fee => _id !== fee._id)
         })
      }
   };

   return (
      <>
         <div className='feeSelect row mb-3'>
            <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
               <SmallHeader text='Fee Select' />
            </div>
            <div className='col-sm-9 col-md-10'>
               <FeeSelect
                  selectedFees={defaultFees}
                  setFee={fee => {
                     setContact(prev => ({
                        ...prev,
                        defaultFees: [
                           ...prev.defaultFees,
                           fee
                        ]
                     }))
                  }}
               />
            </div>
         </div>

         {/* DEFAULT FEES */}
         <div className='defaultFees row'>
            <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-top text-secondary'>
               <SmallHeader text='Default Fees' />
            </div>
            <div className='col-sm-9 col-md-10'>
               <ul className={defaultFeesListClasses} style={defaultFeesListStyles}  >
                  {
                     defaultFees.map(fee => (
                        <li key={fee._id} className={defaultFeesItemClasses} style={defaultFeesItemStyles}>
                           <span className='px-3'>{fee.name}</span>
                           <span className='text-nowrap ms-auto'>{`$ ${fee.amount.toFixed(2)}`}</span>
                           <motion.i
                              className='bi bi-x ps-4 pe-2 py-1 cursor-pointer'
                              onClick={handleRemoveDefaultFee(fee._id)}
                              initial={{
                                 scale: 1,
                                 color: 'inherit'
                              }}
                              whileHover={{
                                 scale: 1.1,
                                 color: 'red',
                              }}
                           >
                           </motion.i>
                        </li>
                     ))
                  }
               </ul>
            </div>
         </div>
      </>
   )
};

export default BillingSelect;