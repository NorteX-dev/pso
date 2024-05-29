export function ackleyFunction(x, y, optimum) {
    let p1 = -20 * Math.exp(-0.2 * Math.sqrt(0.5 * (x * x + y * y)));
    let p2 = Math.exp(0.5 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y)));
    return p1 - p2 + Math.E + 20 + optimum;
}
export function boothFunction(x, y, optimum) {
    let p1 = Math.pow(x + 2 * y - 7, 2);
    let p2 = Math.pow(2 * x + y - 5, 2);
    return p1 + p2 + optimum;
}
export function threeHumpCamelFunction(x, y, optimum) {
    let p1 = 2 * x * x;
    let p2 = 1.05 * Math.pow(x, 4);
    let p3 = Math.pow(x, 6) / 6;
    return p1 - p2 + p3 + x * y + y * y + optimum;
}
