// takes two numbers that represent currencies, mulitply by 100 to make it an integer, add them, divide to return to decimal and return
export const addTwoCurrencies = (num1, num2) => {
   const cents1 = num1 * 100;
   const cents2 = num2 * 100;

   return (cents1 + cents2) / 100;
};

// takes the billing of a job and reduces the amounts to get a total of all the fees
export const billingTotal = (billing) => {
   return billing.reduce((total, bill) => {
      // fee amount is the default, but use the adjusted amount if it has been set
      const amount = bill.adjustedAmount === null ? bill.fee.amount : bill.adjustment;
      return addTwoCurrencies(total, amount);
   }, 0);
};

export const militaryTimeNumber = (dateObject) => {
   const hours = dateObject.getHours() * 100;
   const minutes = dateObject.getMinutes();

   return hours + minutes;
}