export const removeExtraSpaces = (string) => string.replace(/\s+/g, ' ');

// returns true if stirngs are the same
export const noCharChanges = (string1, string2) => {
    return removeExtraSpaces(string1).trim() === removeExtraSpaces(string2).trim();
};