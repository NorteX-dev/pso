import { ackleyFunction, boothFunction, threeHumpCamelFunction } from "./functions.js";
export class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    setCoordinates(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    addCoordinates(vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        this.limit();
    }
    subtractCoordinates(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        this.limit();
    }
    multiplyCoordinates(mult) {
        this.x *= mult;
        this.y *= mult;
        this.z *= mult;
        this.limit();
    }
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    limit() {
        const m = this.magnitude();
        const lt = Number.MAX_VALUE;
        if (m > lt) {
            const r = m / lt;
            this.x /= r;
            this.y /= r;
        }
    }
    clone() {
        return new Vector(this.x, this.y, this.z);
    }
}
export class Particle {
    constructor(functionType, start, end, optimum) {
        if (start >= end) {
            throw new Error("Begin range must be less than end range.");
        }
        this.functionType = functionType;
        this.position = new Vector();
        this.velocity = new Vector();
        this.optimum = optimum;
        this.setRandomPosition(start, end);
        this.bestPosition = this.velocity;
        this.bestSolution = this.calculateSolution();
    }
    calculateSolution() {
        if (this.position.x === undefined || this.position.y === undefined || this.optimum === undefined) {
            // undefined assertion
            throw new Error("Position or optimum of particle is undefined");
        }
        if (this.functionType === "Ackleys") {
            return ackleyFunction(this.position.x, this.position.y, this.optimum);
        }
        else if (this.functionType === "Booths") {
            return boothFunction(this.position.x, this.position.y, this.optimum);
        }
        else if (this.functionType === "Three-Hump") {
            return threeHumpCamelFunction(this.position.x, this.position.y, this.optimum);
        }
        return 0;
    }
    setRandomPosition(start, end) {
        const x = this.pickRandom(start, end);
        const y = this.pickRandom(start, end);
        const z = this.pickRandom(start, end);
        this.position.setCoordinates(x, y, z);
    }
    pickRandom(start, end) {
        return Math.floor(Math.random() * (end - start)) + start;
    }
    updatePersonalBest() {
        const solution = this.calculateSolution();
        if (solution < this.bestSolution) {
            this.bestPosition = this.position;
            this.bestSolution = solution;
        }
    }
    adjustPosition() {
        this.position.addCoordinates(this.velocity);
    }
    getPosition() {
        return this.position.clone();
    }
    getVelocity() {
        return this.velocity.clone();
    }
    getBestPosition() {
        return this.bestPosition.clone();
    }
    getBestSolution() {
        return this.bestSolution;
    }
    setVelocity(velocity) {
        this.velocity = velocity.clone();
    }
}
