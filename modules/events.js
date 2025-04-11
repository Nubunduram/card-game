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
    // Récupère les cartes sélectionnées
    const selectedCards = getSelectedCards(gameState);

    // Si exactement deux cartes sont sélectionnées, on procède au swap
    if (selectedCards.length === 2) {
        const [selectedCard1, selectedCard2] = selectedCards;

        // Enregistre les indices des cartes sélectionnées dans les carrés (squares)
        const card1SquareIndex = selectedCard1.squareIndex;
        const card2SquareIndex = selectedCard2.squareIndex;
        const card1Index = selectedCard1.index;
        const card2Index = selectedCard2.index;

        // Échange les cartes dans les carrés (en tenant compte de leurs indices)
        gameState.boardSquares[card1SquareIndex][card1Index] = selectedCard2;
        gameState.boardSquares[card2SquareIndex][card2Index] = selectedCard1;

        // Mettez à jour les indices des cartes échangées
        selectedCard1.squareIndex = card2SquareIndex;
        selectedCard1.index = card2Index;
        selectedCard2.squareIndex = card1SquareIndex;
        selectedCard2.index = card1Index;

        // Dé-sélectionne les cartes après l'échange
        selectedCard1.selected = false;
        selectedCard2.selected = false;
    }
}

// Check board Results

function checkLine(allCardRevealed, gameState, cards) {
    if (cards.some(card => !card.revealed)) return 0; // Ne pas compter si une carte est cachée

    const [colors, numbers, suits] = ['color', 'number', 'suit'].map(attr => new Set(cards.map(card => card[attr])));

    // 3 Points pour les suits, 1 point pour la couleur (Les 2 ne se cumule pas) + 5 points pour les numbers 
    let points = (suits.size === 1 ? 3 : colors.size === 1 ? 1 : 0) + (numbers.size === 1 ? 5 : 0);

    if (!allCardRevealed && numbers.size === 1) {
        gameState.bonusRoundAvailable += 1;
    }

    return points;
}

export function checkResults(gameState, gameElements) {

    let allCardRevealed = false;

    gameState.phase = 4;
    gameState.bonusRoundAvailable = 0;

    let totalPoints = 0;
    const visibleCardNumber = gameState.visibleCard.number; // Get the number of the visible card

    // Check for 3 cards with the same number as the visible card
    gameState.boardSquares.forEach(square => {
        // Check each line, column, and diagonal
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        lines.forEach(indices => {
            const cardsInLine = indices.map(i => square[i]);

            // Check if there are 3 cards with the same number as the visible card
            const matchingCards = cardsInLine.filter(card => card.number === visibleCardNumber);

            if (matchingCards.length === 3) {
                console.log("shouldReveal All cards")
                // If we find 3 matching cards, reveal all cards
                revealAllCards(gameState);
                allCardRevealed = true;
            }
        });
    });

    // Continue with the normal points counting after revealing the cards
    gameState.boardSquares.forEach(square => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        totalPoints += lines.reduce((sum, indices) => sum + checkLine(allCardRevealed, gameState, indices.map(i => square[i])), 0);
    });

    // Show the final message based on points
    if (gameState.bonusRoundAvailable <= gameState.bonusRoundDone) {
        gameElements.reglesDuJeu.textContent = totalPoints > 0
            ? `Vous avez gagné avec ${totalPoints} points !`
            : "Aucune ligne valide, vous avez perdu.";
    }

    return allCardRevealed
}

// Function to reveal all cards
function revealAllCards(gameState) {
    gameState.boardSquares.forEach(square => {
        square.forEach(card => {
            card.revealed = true; // Reveal each card
        });
    });
}