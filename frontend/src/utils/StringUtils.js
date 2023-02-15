// trims and removes extra spaces from string2, returns true if both are the same
export const noCharChanges = (string1, string2) => {
    return string1 === string2.replace(/\s+/g, ' ').trim();
}