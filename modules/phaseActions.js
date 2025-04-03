// Reveal Card (Phase 1 & 3)

function revealCardElement(cardElement) {
    cardElement.data.revealed = true;
    cardElement.textContent = `${cardElement.data.number} ${cardElement.data.suit}`;
    cardElement.classList.remove("hidden");
    if (cardElement.data.color === "red") cardElement.classList.add("red");
}

function revealIfNeeded(cardElement, counter) {
    if (!cardElement.data.revealed && counter < 3) {
        revealCardElement(cardElement);
        return counter + 1;
    }
    return counter;
};

function revealCard(gameState, cardElement) {
    const card = cardElement.data;

    if (gameState.phase === 1) {
        gameState.revealedCount[card.squareIndex] = revealIfNeeded(cardElement, gameState.revealedCount[card.squareIndex]);
    }

    if (gameState.phase === 3) {
        gameState.revealedCountPhase3 = revealIfNeeded(cardElement, gameState.revealedCountPhase3);
    }

    if (gameState.phase === 6) {

        if (!card.revealed && gameState.bonusRoundAvailable > gameState.bonusRoundDone) {
            revealCardElement(cardElement);
            gameState.bonusRoundDone += 1;
        }
    }
}

// Select cards for Swap (Phase 2 & 5)

function deselectPreviousSelection(gameState, isRevealed) {
    gameState.boardSquares.forEach(square => {
        square.forEach(card => {
            // Only deselect the card if it matches the visibility condition
            if (card.revealed === isRevealed && card.selected) {
                card.selected = false; // Deselect the card
            }
        });
    });
}

function selectNewCard(card) {
    card.selected = true;
}

function showSelectedCards(gameElements) {
    const allCards = gameElements.gameBoard.querySelectorAll(".card");

    allCards.forEach(cardElement => {
        // Remove previous selection classes
        cardElement.classList.remove("selected");

        // Check if the card is selected (whether visible or hidden)
        const card = cardElement.data;
        if (card.selected) {
            cardElement.classList.add("selected");
        }
    });
}

function selectCard(gameState, gameElements, cardElement) {

    if (cardElement.data.revealed) { // If the card is Revealed
        deselectPreviousSelection(gameState, true);
        selectNewCard(cardElement.data);
    } else { // If the card is hidden
        deselectPreviousSelection(gameState, false);
        selectNewCard(cardElement.data);
    }

    // Refresh the board to reflect changes
    showSelectedCards(gameElements);
}

// return Phase Action depending on phase

export function setPhaseAction(gameState, cardElement, gameElements) {
    switch (gameState.phase) {
        case 1:
            revealCard(gameState, cardElement);
            break;
        case 2:
            selectCard(gameState, gameElements, cardElement);
            break;
        case 3:
            revealCard(gameState, cardElement);
            break;
        case 5:
            selectCard(gameState, gameElements, cardElement);
            break
        case 6:
            revealCard(gameState, cardElement);
            break
    }
}