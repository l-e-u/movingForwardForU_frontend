import { formatToCurrencyString } from '../utils/StringUtils';

const Currency = ({ amount }) => {
   if (amount === null) return null;

   let amountText = formatToCurrencyString({
      amount,
      setTwoDecimalPlaces: true
   });

   if (Number(amountText) < 0) amountText = `(${amountText})`;

   return <span>{amountText}</span>;
};

const BillingTable = ({ billing }) => {
   if (billing.length === 0) return null;

   const scopeStyles = { opacity: 0.5 };

   return (
      <table className='table table-sm text-reset m-0'>
         <thead>
            <tr className='text-secondary fs-smaller fw-normal'>
               <th className='fw-normal text-center' scope='col' style={scopeStyles}>#</th>
               <th className='fw-normal' scope='col' style={scopeStyles}>Fee</th>
               <th className='fw-normal text-end' scope='col' style={scopeStyles}>Amount</th>
            </tr>
         </thead>
         <tbody>
            {
               billing.map((bill, index) => (
                  <tr key={bill._id}>
                     <th
                        className='fs-smaller fw-normal text-secondary text-center'
                        scope='row'
                        style={{ ...scopeStyles, fontFamily: 'monospace' }}
                     >
                        {index.toString().padStart(2, '0')}
                     </th>

                     <td>{bill.fee.name}</td>

                     <td className='text-nowrap text-end'>
                        <Currency amount={bill.fee.amount} />
                        <Currency amount={bill.overrideAmount} />
                     </td>
                  </tr>
               ))
            }
         </tbody>
      </table>
   )
}

export default BillingTable;