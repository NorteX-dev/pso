import { Vector, Particle } from "./classes.js";

export class SwarmAlgorithm {
	constructor(functionType, particles, epochs, inertia, cognitive, social, beginRange, endRange, optimum, filterPrecision) {
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
		this.bestPositions = [];
		this.bestSolutions = [];
		this.oldSolutions = [];
		this.algorithmTextLogs = [];
		this.swarmParticles = [];

		console.log("Created SwarmAlgorithm object:");
		console.log(this);
	}

	run() {
		console.log("Running");
		let particles = this.initialize();
		let oldSolution = this.bestSolution;
		// let finalSolution = 0;

		for (let i = 0; i < this.epochs; i++) {
			this.swarmParticles.push(particles);
			this.oldSolutions.push(oldSolution);
			this.bestPositions.push(this.bestPosition);
			this.bestSolutions.push(this.bestSolution);

			let s;
			if (this.bestSolution < oldSolution) {
				s = "Global best solution (Epoch " + i + "):\t" + this.bestSolution.toFixed(20);
				this.algorithmTextLogs.push(s);
				oldSolution = this.bestSolution;
			} else {
				s = "Global best solution (Epoch " + i + "):\t" + this.bestSolution.toFixed(20);
				this.algorithmTextLogs.push(s);
			}

			if (this.filterPrecision === 0) {
				if (this.bestSolution === this.optimum) {
					break;
				}
			} else {
				if (this.bestSolution === this.optimum) {
					break;
				}
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

	updateGlobalBest(particle) {
		if (particle.getBestSolution() < this.bestSolution && particle.getBestSolution() >= this.optimum) {
			this.bestPosition = particle.getBestPosition();
			this.bestSolution = particle.getBestSolution();
		}
	}

	updateVelocity(particle) {
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
