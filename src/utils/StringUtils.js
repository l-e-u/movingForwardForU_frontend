export const paddedZeroStartWhenSingleDigit = (number) => String(number).padStart(2, '0');

export const removeExtraSpaces = (string) => string.replace(/\s+/g, ' ');

// returns true if stirngs are the same
export const noCharChanges = (string1, string2) => {
   return removeExtraSpaces(string1).trim() === removeExtraSpaces(string2).trim();
};

export const dateStringFormat = (date) => {
   const monthNames = [
      { abbr: 'jan', full: 'january' },
      { abbr: 'feb', full: 'february' },
      { abbr: 'mar', full: 'march' },
      { abbr: 'apr', full: 'april' },
      { abbr: 'may', full: 'may' },
      { abbr: 'jun', full: 'june' },
      { abbr: 'jul', full: 'july' },
      { abbr: 'aug', full: 'august' },
      { abbr: 'sep', full: 'september' },
      { abbr: 'oct', full: 'october' },
      { abbr: 'nov', full: 'november' },
      { abbr: 'dec', full: 'december' }
   ];
   const day = paddedZeroStartWhenSingleDigit(date.getDate());
   const month = monthNames[date.getMonth()].abbr;
   const year = date.getFullYear();

   return `${day} ${month} ${year}`;
};

export const timeStringFormat = (date, showMilitary, showTimezone = false) => {
   const militaryHr = date.getHours();
   const hr = militaryHr > 12 ? militaryHr % 12 : militaryHr;
   const meridiem = militaryHr < 12 ? 'A' : 'P';
   const hour = paddedZeroStartWhenSingleDigit(showMilitary ? militaryHr : hr);
   const minutes = paddedZeroStartWhenSingleDigit(date.getMinutes());

   let timeString = hour;

   if (!showMilitary) timeString += ':';

   timeString += minutes;

   if (!showMilitary) timeString += meridiem;

   return timeString;
};

// remove non-digits and format number 1000000 to 1,234,567
export const formatNumber = (n) => n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const removeCommasFromString = (string) => string.replace(/,/g, '');

const formatCurrencyStringWithThousandsGrouping = (currencyString) => currencyString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const filterDigitsFromString = (string) => string.replace(/\D/g, '');

// accepts a number or string and returns a string that represents a currency with thousands grouping, and an option to ensure its fixed to 2 decimals
export const formatToCurrencyString = ({ amount, setTwoDecimalPlaces = false }) => {
   const value = removeCommasFromString(String(amount));
   console.log(value)
   //  return an empty string if value is NaN
   if (isNaN(value) || !value) return;

   const isNegative = value.charAt(0) === '-';
   const decimalIndex = value.indexOf('.');
   const hasDecimal = decimalIndex >= 0;
   let numberString = value;

   // if the string has a decimal, then separate string at the decimal position into left-side & right-side integers
   if (hasDecimal) {
      let leftIntegers = value.substring(0, decimalIndex);
      let rightIntegers = value.substring(decimalIndex);
   }
   else {
      if (setTwoDecimalPlaces) {
         numberString = Number(value).toFixed(2);
      };
   };

   return formatCurrencyStringWithThousandsGrouping(numberString);
};

export const formatCurrency = (input, onBlur = false) => {
   const value = String(input);
   const isNegative = value.charAt(0) === '-';

   let validatedNumString = null;

   const decimalPosition = value.indexOf('.');

   // if value is floating, validate both sides
   if (decimalPosition >= 0) {
      let leftSide = value.substring(0, decimalPosition);
      let rightSide = value.substring(decimalPosition);

      // remove non-digits
      leftSide = formatNumber(leftSide);
      rightSide = formatNumber(rightSide);

      // gets rid of leading zeros, helps keep the commas proper
      if (leftSide.charAt(0) === '0') leftSide = leftSide.substring(1);

      // if all that's entered is a decimal
      if (!leftSide) leftSide += '0';

      // on blur, make sure there's 2 digits after the decimal
      if (onBlur) rightSide += '00';

      // limit the right side to only 2 digits for cents
      rightSide = rightSide.substring(0, 2);

      // join integers by decimal
      validatedNumString = leftSide + '.' + rightSide;
      if (isNegative) validatedNumString = '-' + validatedNumString;
   }
   else {
      validatedNumString = formatNumber(value);
      // gets rid of leading zeros, helps keep the commas proper
      if (validatedNumString.length > 1 && validatedNumString.charAt(0) === '0') validatedNumString = validatedNumString.substring(1);
      if (isNegative) validatedNumString = '-' + validatedNumString;
      if (onBlur) validatedNumString += '.00';
   };

   return validatedNumString;
};

// takes an object, loops through its entries and returns a url query string
export const urlQueryString = (filter) => {
   let query = '';

   Object.entries(filter).forEach(([prop, value]) => {
      query += `&${prop}=${value}`;
   })

   return query;
};

// for the filters when setting the value of existing dates chosen for the date inputs
export const dateStringFormat_YYYY_MM_DD = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')
   }`;