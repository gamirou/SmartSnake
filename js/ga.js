function nextGeneration() {
    calculateFitness();
    brains = [];
    bestSnakes = getBestSnakes();

    // First define all neural networks
    for (let i = 0; i < snakes.length-1; i++) {
        parent1 = randchoice(bestSnakes);
        parent2 = randchoice(bestSnakes);
        brains[i] = parent1.crossOver(parent2);
    }
    brains.push(bestSnakes[0]);

    // Then assign them to current snakes
    for (let i = 0; i < snakes.length; i++) {
        snakes[i].setBrain(brains[i]);
    }

}

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

    for (let i =0 ;i < BEST_SNAKES; i++) {
        bestSnakes.push(snakes[fitnesses[i][1]].brain)
    }
    return bestSnakes;

}


function pickOne() {
    let index = 0;
    let randomValue = Math.random();

    while (randomValue > 0) {
        randomValue = randomValue - snakes[index].fitness;
        index++;
    }
    index--;

    theChosenOne = snakes[index].brain;
    theChosenOne.mutate(0.7);

    return theChosenOne.copy();
}

function calculateFitness() {
    total = 0;
    for (f of snakes) {
        total += f.score;
    }
    for (let i = 0; i < snakes.length; i++) {
        snakes[i].fitness = snakes[i].score / total;
    }
}

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
