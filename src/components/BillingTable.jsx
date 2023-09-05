import { formatToCurrencyString } from '../utils/StringUtils';

const BillingTable = ({ billing }) => {
   const encloseNegativeNumber = (amount) => {
      let currency = formatToCurrencyString({ amount, setTwoDecimalPlaces: true });

      if (amount < 0) return `(${currency})`;

      return currency;
   };

   billing.sort((a, b) => {
      const feeName1 = a.fee.name;
      const feeName2 = b.fee.name;

      if (feeName1 < feeName2) return -1;
      if (feeName1 > feeName2) return 1;

      return 0;
   });

   return (
      <table className='table table-sm text-reset m-0'>
         <thead>
            <tr className='text-secondary fs-smaller'>
               <th className='fw-normal text-center opacity-50' scope='col'></th>
               <th className='fw-normal opacity-50' scope='col'>Fee</th>
               <th className='fw-normal text-end opacity-50' colSpan='2' scope='col'>Amount</th>
            </tr>
         </thead>
         <tbody>
            {
               billing.map((bill, index) => {
                  const { overrideAmount, fee } = bill;
                  const itemNumber = (index + 1).toString().padStart(2, '0');
                  const hasOverrideAmount = overrideAmount !== null;
                  const amountText = encloseNegativeNumber(fee.amount);
                  const overrideAmountText = hasOverrideAmount ? encloseNegativeNumber(overrideAmount) : '';

                  return (
                     <tr key={bill._id || fee._id || index}>
                        <th
                           className='fs-smaller fw-normal text-secondary text-center opacity-50 font-monospace'
                           scope='row'
                        >
                           {itemNumber}
                        </th>

                        <td>{bill.fee.name}</td>

                        <td className='text-nowrap text-end align-middle text-decoration-line-through opacity-50' >
                           {hasOverrideAmount ? amountText : overrideAmountText}
                        </td>
                        <td className='text-nowrap text-end align-middle'>
                           {hasOverrideAmount ? overrideAmountText : amountText}
                        </td>
                     </tr>
                  )
               })
            }
         </tbody>
      </table>
   )
}

export default BillingTable;