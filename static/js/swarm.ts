import { Vector, Particle } from "./classes.js";
import { FunctionType } from "./script.js";

export class SwarmAlgorithm {
	public numOfParticles: number;
	public epochs: number;
	public inertia: number;
	public cognitiveComponent: number;
	public socialComponent: number;
	public functionType: "Ackleys" | "Booths" | "Three-Hump";
	public bestPosition: Vector;
	public bestSolution: number;
	public beginRange: number;
	public endRange: number;
	public optimum: number;
	public filterPrecision: number;

	// ###

	public bestPositions: Vector[] = [];
	public bestSolutions: number[] = [];
	public oldSolutions: number[] = [];
	public logs: string[] = [];

	constructor(
		functionType: FunctionType,
		particles: number,
		epochs: number,
		inertia: number,
		cognitive: number,
		social: number,
		beginRange: number,
		endRange: number,
		optimum: number,
		filterPrecision: number,
	) {
		if (beginRange >= endRange) {
			throw new Error("Begin range must be less than end range.");
		}
		this.numOfParticles = particles;
		this.epochs = epochs;
		this.inertia = inertia;
		this.cognitiveComponent = cognitive;
		this.socialComponent = social;
		this.functionType = functionType;
		this.bestPosition = new Vector(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		this.bestSolution = Number.POSITIVE_INFINITY;
		this.beginRange = beginRange;
		this.endRange = endRange;
		this.optimum = optimum;
		this.filterPrecision = filterPrecision;

		console.log("Created SwarmAlgorithm object:", this);
	}

	run() {
		let particles = this.initialize();
		let oldSolution = this.bestSolution;
		// let finalSolution = 0;

		for (let i = 0; i < this.epochs; i++) {
			this.oldSolutions.push(oldSolution);
			this.bestPositions.push(this.bestPosition);
			this.bestSolutions.push(this.bestSolution);

			if (this.bestSolution < oldSolution) {
				this.logs.push("Global best (Epoch " + i + 1 + "): " + this.bestSolution /*.toFixed(20)*/);
				oldSolution = this.bestSolution;
			} else {
				this.logs.push("Global best (Epoch " + i + 1 + "): " + this.bestSolution /*.toFixed(20)*/);
			}

			if (this.bestSolution === this.optimum) {
				console.log("Reached optimum, finishing.");
				break;
			}

			for (let p of particles) {
				p.updatePersonalBest();
				this.updateGlobalBest(p);
			}

			for (let p of particles) {
				this.updateVelocity(p);
				p.updatePosition();
			}
		}
	}

	initialize() {
		let particles = [];
		for (let i = 0; i < this.numOfParticles; i++) {
			let particle = new Particle(this.functionType, this.beginRange, this.endRange, this.optimum);
			particles.push(particle);
			this.updateGlobalBest(particle);
		}
		return particles;
	}

	updateGlobalBest(particle: Particle) {
		if (particle.getBestSolution() < this.bestSolution && particle.getBestSolution() >= this.optimum) {
			this.bestPosition = particle.getBestPosition();
			this.bestSolution = particle.getBestSolution();
		}
	}

	updateVelocity(particle: Particle) {
		let oldVelocity = particle.getVelocity();
		let particleBestPosition = particle.getBestPosition();
		let globalBestPosition = this.bestPosition.clone();
		let position = particle.getPosition();

		let r1 = Math.random();
		let r2 = Math.random();

		let newVelocity = oldVelocity.clone();
		newVelocity.multiplyCoordinates(this.inertia);

		particleBestPosition.subtractCoordinates(position);
		particleBestPosition.multiplyCoordinates(this.cognitiveComponent);
		particleBestPosition.multiplyCoordinates(r1);
		newVelocity.addCoordinates(particleBestPosition);

		globalBestPosition.subtractCoordinates(position);
		globalBestPosition.multiplyCoordinates(this.socialComponent);
		globalBestPosition.multiplyCoordinates(r2);
		newVelocity.addCoordinates(globalBestPosition);

		particle.setVelocity(newVelocity);
	}

	static getDefaultInertia() {
		return 0.729844;
	}

	static getDefaultCognitive() {
		return 1.49618;
	}

	static getDefaultSocial() {
		return 1.49618;
	}
}
