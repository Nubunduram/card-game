import { distributeCards } from "./modules/deck.js";
import { initGameState, gameElements, phases } from "./modules/constantes.js";
import { setPhaseAction } from "./modules/phaseActions.js";
import { createSquareContainer } from "./modules/utils.js";
import { swapCards, checkResults } from "./modules/events.js";


document.addEventListener("DOMContentLoaded", () => {

    function startPhase(gameState, phaseNumber, gameElements) {
        // Define the phase
        const currentPhase = phases.find(p => p.phase === phaseNumber);
        gameState.phase = currentPhase.phase;

        // Adapt rules
        gameElements.reglesDuJeu.textContent = currentPhase.instructions;
        gameElements.nextPhaseButton.style.display = currentPhase.showNextPhaseButton ? "inline-block" : "none";

        renderBoard(gameState, gameElements);
    }

    function renderBoard(gameState, gameElements) {
        // Reset Board
        gameElements.gameBoard.innerHTML = "";

        gameState.boardSquares.forEach((square) => {

            const squareContainer = createSquareContainer();
            // Fill the squares with cards
            square.forEach((cardData) => {
                const cardElement = createCardElement(gameState, cardData);
                squareContainer.appendChild(cardElement);
            });

            // Add the square to the board
            gameElements.gameBoard.appendChild(squareContainer);
        });
    }

    function createCardElement(gameState, cardData) {
        const cardElement = document.createElement("div");

        cardElement.classList.add("card");

        cardElement.data = cardData;
        const card = cardElement.data;

        if (card.revealed) {
            cardElement.textContent = `${card.number} ${card.suit}`;
            if (card.color === "red") cardElement.classList.add("red");
        } else {
            cardElement.classList.add("hidden");
        }

        addCardEventListener(gameState, cardElement);

        return cardElement;
    }

    function addCardEventListener(gameState, cardElement) {
        cardElement.addEventListener("click", () => {
            setPhaseAction(gameState, cardElement, gameElements);
            checkForNextPhase(gameState);
        });
    }

    function checkForNextPhase(gameState) {

        if (gameState.phase === 1 && gameState.revealedCount.every(count => count === 3)) {
            gameState.revealedCount = [0, 0, 0];
            startPhase(gameState, 2, gameElements);
        }

        if (gameState.phase === 2) {
            gameElements.nextPhaseButton.addEventListener("click", () => {
                startPhase(gameState, 3, gameElements);
                swapCards(gameState);
            });
        }

        if (gameState.phase === 3 && gameState.revealedCountPhase3 === 3) {
            gameState.revealCardPhase3 = 0;
            startPhase(gameState, 4, gameElements);
            checkResults(gameState, gameElements);
        }

        if (gameState.phase === 4 && gameState.bonusRoundAvailable > gameState.bonusRoundDone) {
            startPhase(gameState, 5, gameElements)
        }

        if (gameState.phase === 5) {
            gameElements.nextPhaseButton.addEventListener("click", () => {
                startPhase(gameState, 6, gameElements);
                swapCards(gameState);
            });
        }

        if (gameState.phase === 6 && gameState.bonusRoundDone > 0) {
            checkResults(gameState, gameElements)
            if (gameState.bonusRoundAvailable > gameState.bonusRoundDone) {
                startPhase(gameState, 5, gameElements)
            }
        }
    }

    function startGame() {
        const gameState = initGameState();
        gameState.boardSquares = distributeCards(gameElements);
        startPhase(gameState, 1, gameElements);
    }

    gameElements.startButton.addEventListener("click", () => startGame());
});