// Swap Cards at Start of Phase 3

function getSelectedCards(gameState) {
    let selectedCards = [];

    gameState.boardSquares.forEach(square => {
        square.forEach(card => {
            if (card.selected) {
                selectedCards.push(card);
            }
        });
    });

    return selectedCards
}

export function swapCards(gameState) {
    // Find the two selected cards
    const selectedCards = getSelectedCards(gameState);

    // If exactly two cards are selected, swap their positions
    if (selectedCards.length === 2) {
        const [selectedCard1, selectedCard2] = selectedCards;

        // Update boardSquares data with swapped indices
        gameState.boardSquares[selectedCard1.squareIndex][selectedCard1.index] = selectedCard2;
        gameState.boardSquares[selectedCard2.squareIndex][selectedCard2.index] = selectedCard1;

        // Deselect the swapped cards
        gameState.boardSquares[selectedCard1.squareIndex][selectedCard1.index].selected = false;
        gameState.boardSquares[selectedCard2.squareIndex][selectedCard2.index].selected = false;
    }
}

// Check board Results

function checkLine(gameState, cards) {
    if (cards.some(card => !card.revealed)) return 0; // Ne pas compter si une carte est cachée

    const [colors, numbers, suits] = ['color', 'number', 'suit'].map(attr => new Set(cards.map(card => card[attr])));

    // 3 Points pour les suits, 1 point pour la couleur (Les 2 ne se cumule pas) + 5 points pour les numbers 
    let points = (suits.size === 1 ? 3 : colors.size === 1 ? 1 : 0) + (numbers.size === 1 ? 5 : 0);
    if (numbers.size === 1) {
        gameState.bonusRoundAvailable += 1;
    }

    return points;
}

export function checkResults(gameState, gameElements) {
    
    gameState.phase = 4;
    gameState.bonusRoundAvailable = 0;

    let totalPoints = 0;

    gameState.boardSquares.forEach(square => {

        const lines = [
            // Lignes
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            // Colonnes
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            // Diagonales
            [0, 4, 8], [2, 4, 6]
        ];

        totalPoints += lines.reduce((sum, indices) => sum + checkLine(gameState, indices.map(i => square[i])), 0);
    });

    if (gameState.bonusRoundAvailable === gameState.bonusRoundDone) {
        // Affichage du résultat
        gameElements.reglesDuJeu.textContent = totalPoints > 0
            ? `Vous avez gagné avec ${totalPoints} points !`
            : "Aucune ligne valide, vous avez perdu.";
    }

}