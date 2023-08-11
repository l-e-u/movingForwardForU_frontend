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

export const datePrettyString = ({ dateObject, dateString, includeTime }) => {
   let date = dateObject;

   if (dateString) date = new Date(dateString);

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
   const weekdayNames = [
      { abbr: 'sun', full: 'sunday' },
      { abbr: 'mon', full: 'monday' },
      { abbr: 'tue', full: 'tuesday' },
      { abbr: 'wed', full: 'wednesday' },
      { abbr: 'thu', full: 'thursday' },
      { abbr: 'fri', full: 'friday' },
      { abbr: 'sat', full: 'saturday' },
   ];

   const year = date.getFullYear();
   const month = monthNames[date.getMonth()].full.padStart(2, '0');
   const day = date.getDate().toString().padStart(2, '0');
   const weekday = weekdayNames[date.getDay()].full;
   const prettyDate = `${weekday}, ${day} ${month} ${year}`;
   let prettyTime = '';

   if (includeTime) {
      let hours = date.getHours();
      const meridiem = hours < 12 ? 'AM' : 'PM';
      const minutes = date.getMinutes();

      hours %= 12;

      if (hours === 0) hours = 12;
      prettyTime = `${hours}:${minutes} ${meridiem}, `;
   };

   return prettyTime + prettyDate;
};

export const timeStringFormat = ({ dateString, showMilitary, showTimezone = false }) => {
   const date = new Date(dateString);
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

export const filterDigitsFromString = (string) => string.replace(/\D/g, '');

// formats a string to represent a currency with thousands grouping, and an option to round decimals to two places
export const formatToCurrencyString = ({
   amount,
   setTwoDecimalPlaces = false
}) => {
   const value = removeCommasFromString(amount.toString());
   let [integer, decimal] = value.split('.');
   const hasDecimal = decimal?.length >= 0;

   if (hasDecimal) {
      // limit the decimal places to two
      if (decimal.length > 2) {
         decimal = `.${decimal.charAt(0)}${decimal.charAt(1)}`;
      }
      else {
         // include the decimal, it was removed when the string was split
         decimal = `.${decimal}`;
      };
   };

   if (setTwoDecimalPlaces) {
      if (!integer) integer = '0';

      if (hasDecimal) {
         decimal = decimal.padEnd(3, '0');
      }
      else {
         decimal = '.00';
      }
   };

   return `${formatCurrencyStringWithThousandsGrouping(integer)}${decimal || ''}`;
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

// date input value only accepts strings in YYYY-MM-dd format
export const dateObjectToFormattedString__YYYY_MM_DD = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')
   }`;

// returns a formatted phone number
export const phoneNumberFormatted = (phoneNumber) => {
   if (!phoneNumber) return '';

   const digits = phoneNumber.split('');
   return `(${digits[0]}${digits[1]}${digits[2]}) ${digits[3]}${digits[4]}${digits[5]}-${digits[6]}${digits[7]}${digits[8]}${digits[9]}`;
};