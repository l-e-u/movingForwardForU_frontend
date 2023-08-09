// functions
import { formatCurrency } from '../utils/StringUtils';

const FeesList = ({ billing }) => {
   // styling for the main list
   const listClasses = 'billingList m-0 p-0';
   const listStyles = { listStyle: 'none' };

   // styling for listed items
   const itemClasses = 'd-flex justify-content-between';

   // sort the list of fees alphabetically by fee name
   billing.sort((a, b) => {
      if (a.fee.name < b.fee.name) return -1;
      if (a.fee.name > b.fee.name) return 1;
      return 0;
   });

   return (
      <ul className={listClasses} style={listStyles}>
         {billing.map(bill => {
            const { overrideAmount, fee } = bill;
            const isAdjusted = overrideAmount !== null;
            const amount = isAdjusted ? overrideAmount : fee.amount;
            let currency = formatCurrency(amount, true);

            if (amount < 0) currency = `(-${currency})`;

            return (
               <li key={fee._id} className={itemClasses}>
                  <span>{fee.name}</span>
                  <span >{currency}</span>
               </li>
            )
         })}
      </ul>
   );
};

export default FeesList;