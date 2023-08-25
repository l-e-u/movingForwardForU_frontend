import { formatToCurrencyString } from '../utils/StringUtils';

const BillingTable = ({ billing }) => {
   const scopeStyles = { opacity: 0.5 };
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
               <th className='fw-normal text-center' scope='col' style={scopeStyles}></th>
               <th className='fw-normal' scope='col' style={scopeStyles}>Fee</th>
               <th className='fw-normal text-end' colSpan='2' scope='col' style={scopeStyles}>Amount</th>
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
                     <tr key={bill._id || fee._id}>
                        <th
                           className='fs-smaller fw-normal text-secondary text-center'
                           scope='row'
                           style={{ ...scopeStyles, fontFamily: 'monospace' }}
                        >
                           {itemNumber}
                        </th>

                        <td>{bill.fee.name}</td>

                        <td
                           className='text-nowrap text-end align-middle text-decoration-line-through'
                           style={{ opacity: 0.5 }}
                        >
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