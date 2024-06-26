import { Vector, Particle } from "./classes.js";
import { appendLog } from "./util.js";
export class Swarm {
    constructor({ functionType, particles, epochs, inertia, cognitive, social, beginRange, endRange, optimum, filterPrecision, }) {
        this.bestPositions = [];
        this.bestSolutions = [];
        this.oldSolutions = [];
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
        console.log("Created Swarm object:", this);
    }
    run() {
        let particles = this.createParticles();
        let oldSolution = this.bestSolution;
        for (let i = 0; i < this.epochs; i++) {
            this.oldSolutions.push(oldSolution);
            this.bestPositions.push(this.bestPosition);
            this.bestSolutions.push(this.bestSolution);
            if (this.bestSolution < oldSolution) {
                appendLog(`Global best (Epoch ${i + 1}): ${this.bestSolution.toFixed(20)}`);
                oldSolution = this.bestSolution;
            }
            else {
                appendLog(`Global best (Epoch ${i + 1}): ${this.bestSolution.toFixed(20)}`);
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
                p.adjustPosition();
                console.log(`Particle best solution (Epoch ${i + 1}): `, p.bestSolution);
            }
        }
    }
    createParticles() {
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
}
