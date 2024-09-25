// Classe GeneticAlgorithm
class GeneticAlgorithm {
    constructor(targetLength, charset, populationSize, generationLimit, mutationRate, selectionSize) {
        this.targetLength = targetLength;
        this.charset = charset;
        this.populationSize = populationSize;
        this.generationLimit = generationLimit;
        this.mutationRate = mutationRate;
        this.selectionSize = selectionSize;
        this.target = this.generateRandomString(targetLength);
        this.population = this.initializePopulation();
    }

    generateRandomString(length) {
        return Array.from({length}, () => this.charset[Math.floor(Math.random() * this.charset.length)]).join('');
    }

    initializePopulation() {
        return Array.from({length: this.populationSize}, () => this.generateRandomString(this.targetLength));
    }

    calculateFitness(individual) {
        return individual.split('').reduce((acc, char, index) => acc + (char === this.target[index] ? 1 : 0), 0);
    }

    selectParent(individuals) {
        const totalFitness = individuals.reduce((acc, individual) => acc + this.calculateFitness(individual), 0);
        let randomPoint = Math.random() * totalFitness;
        
        for (const individual of individuals) {
            randomPoint -= this.calculateFitness(individual);
            if (randomPoint <= 0) {
                return individual;
            }
        }
        
        return individuals[individuals.length - 1];
    }

    crossover(parent1, parent2) {
        const crossoverPoint = Math.floor(Math.random() * this.targetLength);
        return parent1.slice(0, crossoverPoint) + parent2.slice(crossoverPoint);
    }

    mutate(individual) {
        return individual.split('').map(char => 
            Math.random() < this.mutationRate / 100 ? this.charset[Math.floor(Math.random() * this.charset.length)] : char
        ).join('');
    }

    evolve() {
        const newPopulation = [];
        
        // Sélectionner les meilleurs individus
        const sortedPopulation = this.population.sort((a, b) => this.calculateFitness(b) - this.calculateFitness(a));
        const selectedIndividuals = sortedPopulation.slice(0, this.selectionSize);
        
        while (newPopulation.length < this.populationSize) {
            const parent1 = this.selectParent(selectedIndividuals);
            const parent2 = this.selectParent(selectedIndividuals);
            let child = this.crossover(parent1, parent2);
            child = this.mutate(child);
            newPopulation.push(child);
        }
        
        this.population = newPopulation;

        const bestIndividual = this.population.reduce((best, individual) => {
            const fitness = this.calculateFitness(individual);
            return fitness > this.calculateFitness(best) ? individual : best;
        });

        return {
            bestIndividual,
            fitness: this.calculateFitness(bestIndividual)
        };
    }
}
