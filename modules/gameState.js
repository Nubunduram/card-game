export function createGameState() {
    return {
        boardSquares: [],
        phase: 1,
        revealedCount: [0, 0, 0],
        revealedCountPhase3: 0,
        selectedVisibleCard: null,
        selectedHiddenCard: null,
    };
}
