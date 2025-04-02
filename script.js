import { distributeCards } from "./modules/deck.js";
import { gameElements, phases } from "./modules/constantes.js";
import { createGameState } from "./modules/gameState.js";

import { checkResults } from "./modules/checkResults.js";
import { swapCards, selectCard, getCardDetails, createSquareContainer } from "./modules/utils.js";

document.addEventListener("DOMContentLoaded", () => {

    function startPhase(gameState, phaseNumber, gameElements) {
        // Define the phase
        const currentPhase = phases.find(p => p.phase === phaseNumber);
        gameState.phase = currentPhase.phase;
        // Adapt rules
        gameElements.reglesDuJeu.textContent = currentPhase.instructions;
        gameElements.nextPhaseButton.style.display = currentPhase.showNextButton ? "inline-block" : "none";

        // If phase 2
        gameState.phase === 2
            ? gameElements.nextPhaseButton.addEventListener("click", () => startPhase(gameState, 3, gameElements))
            : gameElements.nextPhaseButton.removeEventListener("click", () => startPhase(gameState, 3, gameElements));

        // If phase 3
        gameState.phase === 3
            ? swapCards(gameState)
            : null;

        renderBoard(gameState, phaseNumber);
    }

    function renderBoard(gameState) {
        // Reset Board
        gameElements.gameBoard.innerHTML = "";

        gameState.boardSquares.forEach((square, squareIndex) => {

            const squareContainer = createSquareContainer();

            // Fill the squares with cards
            square.forEach((card, cardIndex) => {
                const cardElement = createCardElement(gameState, card, squareIndex, cardIndex);
                squareContainer.appendChild(cardElement);
            });

            // Add the square to the board
            gameElements.gameBoard.appendChild(squareContainer);
        });
    }

    function createCardElement(gameState, card, squareIndex, cardIndex) {
        const cardElement = document.createElement("div");

        cardElement.classList.add("card");

        if (card.revealed) {
            cardElement.textContent = `${card.number} ${card.suit}`;
            if (card.color === "red") cardElement.classList.add("red");
        } else {
            cardElement.classList.add("hidden");
        }

        cardElement.dataset.square = squareIndex;
        cardElement.dataset.index = cardIndex;

        addCardEventListener(gameState, cardElement);

        return cardElement;
    }

    function addCardEventListener(gameState, cardElement) {
        cardElement.addEventListener("click", () => {
            switch (gameState.phase) {
                case 1:
                    revealCardPhase1(gameState, cardElement);
                    break;
                case 2:
                    selectCard(gameState, cardElement, gameElements);
                    break;
                case 3:
                    revealCardPhase3(gameState, cardElement);
                    break;
            }
        });
    }

    function updateCardDisplay(card, cardElement) {
        card.revealed = true;
        cardElement.textContent = `${card.number} ${card.suit}`;
        cardElement.classList.remove("hidden");
        if (card.color === "red") cardElement.classList.add("red");
    }

    function revealCardPhase1(gameState, cardElement) {
        const { squareIndex, card } = getCardDetails(gameState, cardElement);

        if (!card.revealed && gameState.revealedCount[squareIndex] < 3) {
            updateCardDisplay(card, cardElement);
            gameState.revealedCount[squareIndex]++;
        }

        if (gameState.revealedCount[squareIndex] === 3) {
            gameElements.reglesDuJeu.textContent = `Carré ${squareIndex + 1} complété.`;

            if (gameState.revealedCount.every(count => count === 3)) {
                startPhase(gameState, 2, gameElements);
            }
        }
    }

    function revealCardPhase3(gameState, cardElement) {
        const { card } = getCardDetails(gameState, cardElement);

        if (!card.revealed) {
            updateCardDisplay(card, cardElement);
            gameState.revealedCountPhase3++;
            gameState.revealedCountPhase3 === 3 ? checkResults(gameState, gameElements) : null
        }
    }

    function startGame() {
        const gameState = createGameState();
        gameState.boardSquares = distributeCards(gameElements);
        startPhase(gameState, 1, gameElements);
    }

    gameElements.startButton.addEventListener("click", () => startGame());
});