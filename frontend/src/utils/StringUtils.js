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

export const timeStringFormat = (date, showTimezone = false) => {
    const hour = paddedZeroStartWhenSingleDigit(date.getHours());
    const minutes = paddedZeroStartWhenSingleDigit(date.getMinutes());

    return `${hour}${minutes}`;
};