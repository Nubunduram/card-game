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
        instructions: "",
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
    };
}