export function checkIfEven(num: number): boolean {
    return num % 2 === 0;
}

export function checkIfOdd(num: number) {
    if(num % 2 !== 0) {
        throw new Error("Number is not even");
    }
}