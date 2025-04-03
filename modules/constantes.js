export const phases = [
    {
        phase: 1,
        instructions: "Phase 1 : Retournez 3 cartes dans chaque carré.",
        showNextPhaseButton: false
    },
    {
        phase: 2,
        instructions: "Phase 2 (optionnel) : Sélectionnez une carte visible et une carte cachée pour échanger leurs positions.",
        showNextPhaseButton: true
    },
    {
        phase: 3,
        instructions: "Phase 3 : Découvrez 3 nouvelles cartes.",
        showNextPhaseButton: false
    },
    {
        phase: 4,
        instructions: "Vlà la phose quotre lô",
        showNextPhaseButton: false
    },
    {
        phase: 5,
        instructions: "Phase Bonus (optionnel) : Sélectionnez une carte visible et une carte cachée pour échanger leurs positions.",
        showNextPhaseButton: true
    },
    {
        phase: 6,
        instructions: "Phase Bonus : Révelez 1 nouvelle carte.",
        showNextPhaseButton: false
    }
];

export const gameElements = {
    visibleCardContainer: document.getElementById("off-card"),
    gameBoard: document.getElementById("game-board"),
    startButton: document.getElementById("start-game"),
    reglesDuJeu: document.getElementById("regles-du-jeu"),
    nextPhaseButton: document.getElementById("next-phase")
}

export function initGameState() {
    return {
        boardSquares: [],
        phase: 1,
        revealedCount: [0, 0, 0],
        revealedCountPhase3: 0,
        bonusRoundAvailable: 0,
        bonusRoundDone: 0,
    };
}