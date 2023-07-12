// takes two numbers that represent currencies, mulitply by 100 to make it an integer, add them, divide to return to decimal and return
export const addTwoCurrencies = (num1, num2) => {
    const cents1 = num1 * 100;
    const cents2 = num2 * 100;

    return (cents1 + cents2) / 100;
}