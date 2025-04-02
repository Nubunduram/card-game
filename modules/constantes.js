export const phases = [
    {
        phase: 1,
        instructions: "Phase 1 : Retournez 3 cartes dans chaque carré.",
        showNextButton: false
    },
    {
        phase: 2,
        instructions: "Phase 2 (optionnel) : Sélectionnez une carte visible et une carte cachée pour échanger leurs positions.",
        showNextButton: true
    },
    {
        phase: 3,
        instructions: "Découvrez 3 nouvelles cartes.",
        showNextButton: false
    },
    {
        phase: 4,
        instructions: "",
        showNextButton: false
    }
];

export const gameElements = {
    visibleCardContainer: document.getElementById("off-card"),
    gameBoard: document.getElementById("game-board"),
    startButton: document.getElementById("start-game"),
    reglesDuJeu: document.getElementById("regles-du-jeu"),
    nextPhaseButton: document.getElementById("next-phase")
}