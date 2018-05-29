function nextGeneration() {
    // All fitnesses get normalized
    calculateFitness();
    brains = [];
    bestSnakes = getBestSnakes();

    // First define all neural networks
    for (let i = 0; i < snakes.length-1; i++) {
        // Pick two random parents
        // NOTE: It can be the same parent for both of them
        parent1 = randchoice(bestSnakes);
        parent2 = randchoice(bestSnakes);

        if (parent1 !== parent2) {
            brains[i] = parent1.crossOver(parent2);
        } else {
            brains[i] = parent1;
        }
    }
    // Best one is added
    brains.push(bestSnakes[0]);

    // Then assign them to current snakes
    for (let i = 0; i < snakes.length; i++) {
        snakes[i].setBrain(brains[i]);
    }
}

/**
 * Get the best brains based on their fitnesses
 * @return {Array} Array of best "BEST_SNAKES" brains
 */
function getBestSnakes() {
    fitnesses = [];
    bestSnakes = [];

    for (let i = 0; i < snakes.length; i++) {
        fitnesses.push([snakes[i].fitness, i]);
    }
    fitnesses.sort(sortFunction);

    function sortFunction(a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? 1 : -1;
        }
    }

    for (let i = 0; i < BEST_SNAKES; i++) {
        bestSnakes.push(snakes[fitnesses[i][1]].brain);
        // They are mutated
        bestSnakes[i].mutate(0.1);
    }
    return bestSnakes;

}


function calculateFitness() {
    total = 0;
    for (f of snakes) {
        total += Math.abs(f.score);
    }
    for (let i = 0; i < snakes.length; i++) {
        snakes[i].fitness = snakes[i].score / total;
    }
}


/**
 * It sorts an array based on an insertion sort
 * @param  {Array} arr Array to be sorted
 * @return {Array}     Sorted array
 */
/* Used only for debugging
function insertionSort(arr) {
    sortedArr = [];
    oldArr = arr.slice();

    for (let i = 0; i < arr.length-1; i++) {
        sortedArr.push(oldArr.min());
        oldArr.splice(oldArr.indexOf(oldArr.min()), 1);
    }

    sortedArr.push(oldArr[0]);

    return sortedArr;
}
*/
