import { ackleyFunction, boothFunction, threeHumpCamelFunction } from "./functions.js";
import { FunctionType } from "./script.js";

// Klasa wektora
export class Vector {
	public x: number;
	public y: number;
	public z: number;

	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	setCoordinates(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	addCoordinates(v: Vector) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.limit();
	}

	subtractCoordinates(v: Vector) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.limit();
	}

	multiplyCoordinates(s: number) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		this.limit();
	}

	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	limit() {
		const m = this.mag();
		const limit = Number.MAX_VALUE;
		if (m > limit) {
			const ratio = m / limit;
			this.x /= ratio;
			this.y /= ratio;
		}
	}

	clone() {
		return new Vector(this.x, this.y, this.z);
	}

	toString() {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}
}

export class Particle {
	public functionType: string;
	public position: Vector;
	public velocity: Vector;
	public bestPosition: Vector;
	public bestSolution: number;
	public optimum: number;

	constructor(functionType: FunctionType, beginRange: number, endRange: number, optimum: number) {
		if (beginRange >= endRange) {
			throw new Error("Begin range must be less than end range.");
		}
		this.functionType = functionType;
		this.position = new Vector();
		this.velocity = new Vector();
		this.optimum = optimum;
		this.setRandomPosition(beginRange, endRange);
		this.bestPosition = this.velocity.clone();
		this.bestSolution = this.calculateSolution();
	}

	calculateSolution(): number {
		if (this.position.x === undefined || this.position.y === undefined || this.optimum === undefined) {
			// undefined assertion
			throw new Error("Position or optimum of particle is undefined");
		}

		if (this.functionType === "Ackleys") {
			return ackleyFunction(this.position.x, this.position.y, this.optimum);
		} else if (this.functionType === "Booths") {
			return boothFunction(this.position.x, this.position.y, this.optimum);
		} else {
			return threeHumpCamelFunction(this.position.x, this.position.y, this.optimum);
		}
	}

	setRandomPosition(beginRange: number, endRange: number) {
		const x = this.rand(beginRange, endRange);
		const y = this.rand(beginRange, endRange);
		const z = this.rand(beginRange, endRange);
		this.position.setCoordinates(x, y, z);
	}

	rand(beginRange: number, endRange: number) {
		return Math.floor(Math.random() * (endRange - beginRange)) + beginRange;
	}

	updatePersonalBest() {
		const solution = this.calculateSolution();
		if (solution < this.bestSolution) {
			this.bestPosition = this.position.clone();
			this.bestSolution = solution;
		}
	}

	updatePosition() {
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

	setVelocity(velocity: Vector) {
		this.velocity = velocity.clone();
	}
}
