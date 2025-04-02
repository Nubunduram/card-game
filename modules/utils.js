// at Start of Phase 3 
export function swapCards(gameState) {
    if (gameState.selectedVisibleCard && gameState.selectedHiddenCard) {
        const { squareIndex: visibleSquare, cardIndex: visibleIndex } = gameState.selectedVisibleCard;
        const { squareIndex: hiddenSquare, cardIndex: hiddenIndex } = gameState.selectedHiddenCard;

        [gameState.boardSquares[visibleSquare][visibleIndex], gameState.boardSquares[hiddenSquare][hiddenIndex]] =
            [gameState.boardSquares[hiddenSquare][hiddenIndex], gameState.boardSquares[visibleSquare][visibleIndex]];
    }
}

// To Render game Board
export function createSquareContainer() {
    const squareContainer = document.createElement("div");
    squareContainer.classList.add("square");
    return squareContainer;
}

// Sélectionner une carte pour l'échange (phase 2)
export function selectCard(gameState, cardElement, gameElements) {
    const { squareIndex, cardIndex, card } = getCardDetails(gameState, cardElement);

    unselectCard(card, gameElements);
    cardElement.classList.add("selected");

    if (card.revealed) {
        gameState.selectedVisibleCard = { squareIndex, cardIndex, card };
        gameElements.reglesDuJeu.textContent = "Carte face visible sélectionnée. Sélectionnez une carte face cachée.";
    } else {
        gameState.selectedHiddenCard = { squareIndex, cardIndex, card };
        gameElements.reglesDuJeu.textContent = "Carte face cachée sélectionnée. Cliquez sur 'Passer à la phase 3' pour échanger.";
    }
}

// Unselect the card previously selected when selecting another
function unselectCard(card, gameElements) {

    const allCards = gameElements.gameBoard.querySelectorAll(".card");

    allCards.forEach(cardElement =>
        ((cardElement.classList.contains("hidden") !== card.revealed) ? cardElement.classList.remove("selected") : null)
    );
}

export function getCardDetails(gameState, cardElement) {
    const squareIndex = Number(cardElement.dataset.square);
    const cardIndex = Number(cardElement.dataset.index);
    const card = gameState.boardSquares[squareIndex][cardIndex];

    return { squareIndex, cardIndex, card };
}