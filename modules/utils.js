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

// at Start of Phase 3 
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


export function createSquareContainer() {
    const squareContainer = document.createElement("div");
    squareContainer.classList.add("square");
    return squareContainer;
}

// Helper function to deselect all selected cards in a given board square based on visibility
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

// Helper function to select a card
function selectNewCard(card) {
    card.selected = true;
}

export function selectCard(gameState, gameElements, card) {
    if (card.revealed) {
        // Deselect any previously selected visible card
        deselectPreviousSelection(gameState, true);
        // Select the new visible card
        selectNewCard(card);
        gameElements.reglesDuJeu.textContent = "Carte face visible sélectionnée. Sélectionnez une carte face cachée.";
    } else { // If the card is hidden
        // Deselect any previously selected hidden card
        deselectPreviousSelection(gameState, false);
        // Select the new hidden card
        selectNewCard(card);
        gameElements.reglesDuJeu.textContent = "Carte face cachée sélectionnée. Cliquez sur 'Passer à la phase 3' pour échanger.";
    }

    // Refresh the board to reflect changes
    showSelectedCards(gameElements);
}


function showSelectedCards(gameElements) {
    const allCards = gameElements.gameBoard.querySelectorAll(".card");

    allCards.forEach(cardElement => {
        // Remove previous selection classes
        cardElement.classList.remove("selected");

        // Check if the card is selected (whether visible or hidden)
        const card = cardElement.card;
        if (card.selected) {
            cardElement.classList.add("selected");
        }
    });
}





