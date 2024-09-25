// Script principal
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('geneticForm');
    const historyContainer = document.getElementById('generationHistory');
    const totalGenerationsSpan = document.getElementById('totalGenerations');
    const targetStringSpan = document.getElementById('targetString');
    const bestMatchSpan = document.getElementById('bestMatch');
    const matchCountSpan = document.getElementById('matchCount');
    const stopButton = document.getElementById('stopButton');
    let ga; // Variable pour stocker l'instance de l'algorithme génétique
    let isRunning = false;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        startAlgorithm();
    });

    stopButton.addEventListener('click', function() {
        isRunning = false;
        stopButton.disabled = true;
    });

    let explainButton = document.getElementById('explainButton');
    let explanationModal = new bootstrap.Modal(document.getElementById('explanationModal'));
    
    explainButton.addEventListener('click', function() {
        explanationModal.show();
    });

    function startAlgorithm() {
        // Arrêter l'algorithme précédent s'il est en cours
        isRunning = false;
    
        // Récupération des valeurs du formulaire
        const targetLength = parseInt(document.getElementById('targetLength').value);
        const useLowercase = document.getElementById('useLowercase').checked;
        const useUppercase = document.getElementById('useUppercase').checked;
        const useNumbers = document.getElementById('useNumbers').checked;
        const populationSize = parseInt(document.getElementById('populationSize').value);
        const selectionSize = parseInt(document.getElementById('selectionSize').value);
        const generationLimit = parseInt(document.getElementById('generationLimit').value);
        const mutationRate = parseFloat(document.getElementById('mutationRate').value);
    
        // Création du charset
        let charset = '';
        if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useNumbers) charset += '0123456789';
    
        // Initialisation de l'algorithme génétique
        ga = new GeneticAlgorithm(targetLength, charset, populationSize, generationLimit, mutationRate, selectionSize);
    
        // Réinitialisation de l'interface utilisateur
        targetStringSpan.textContent = ga.target;
        historyContainer.innerHTML = '';
        totalGenerationsSpan.textContent = '000000';
        bestMatchSpan.innerHTML = '';
        matchCountSpan.textContent = '0/' + targetLength;
    
        // Activation du bouton d'arrêt
        stopButton.disabled = false;
        isRunning = true;
    
        // Lancement de l'algorithme
        runStep(1);
    }

    function runStep(generation) {
        if (!isRunning) {
            console.log("Algorithme arrêté manuellement");
            return;
        }

        const result = ga.evolve();
        
        // Création et ajout de la carte de génération
        const card = document.createElement('p');
        card.className = "value-res";
        let generation_str = generation.toString().padStart(6, '0');
        card.innerHTML = `${generation_str} - ${result.bestIndividual} / Fitness: ${result.fitness}`;
        historyContainer.appendChild(card);

        // Défilement automatique vers la droite
        historyContainer.scrollLeft = historyContainer.scrollWidth;

        // Mise à jour du nombre total de générations et de la meilleure correspondance
        totalGenerationsSpan.textContent = generation_str;
        bestMatchSpan.innerHTML = colorMatchingChars(result.bestIndividual, ga.target);
        matchCountSpan.textContent = `${result.fitness}/${ga.targetLength}`;

        // Vérification des conditions d'arrêt
        if (result.fitness === ga.targetLength) {
            console.log("Solution trouvée !");
            isRunning = false;
            stopButton.disabled = true;
        } else if (generation < ga.generationLimit) {
            requestAnimationFrame(() => runStep(generation + 1));
        } else {
            console.log("Limite de générations atteinte");
            isRunning = false;
            stopButton.disabled = true;
        }
    }

    function colorMatchingChars(str, target) {
        return str.split('').map((char, index) => 
            char === target[index] ? `<span style="color: red;">${char}</span>` : char
        ).join('');
    }
});