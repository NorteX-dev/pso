export function ackleyFunction(x, y, optimum) {
    let comp1 = -20 * Math.exp(-0.2 * Math.sqrt(0.5 * (x * x + y * y)));
    let comp2 = Math.exp(0.5 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y)));
    return comp1 - comp2 + Math.E + 20 + optimum;
}
export function boothFunction(x, y, optimum) {
    let comp1 = Math.pow(x + 2 * y - 7, 2);
    let comp2 = Math.pow(2 * x + y - 5, 2);
    return comp1 + comp2 + optimum;
}
export function threeHumpCamelFunction(x, y, optimum) {
    let comp1 = 1.05 * Math.pow(x, 4);
    let comp2 = Math.pow(x, 6) / 6;
    return 2 * x * x - comp1 + comp2 + x * y + y * y + optimum;
}
