export function checkIfEven(num: number): boolean {
    if (num % 2 === 0) {
        return true;
    } else {
        throw new Error("Number is not even");
    }
}