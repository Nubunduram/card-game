import { distributeCards } from "./modules/deck.js";
import { checkResults } from "./modules/checkResults.js";
import { visibleCardContainer, gameBoard, startButton, reglesDuJeu, nextPhaseButton, phases } from "./modules/constantes.js";
import { createGameState } from "./modules/gameState.js";

document.addEventListener("DOMContentLoaded", () => {

    function startGame() {
        const gameState = createGameState();
        gameState.boardSquares = distributeCards(visibleCardContainer);
        startPhase(gameState, 1);
    }

    function renderBoard(gameState) {
        gameBoard.innerHTML = "";

        gameState.boardSquares.forEach((square, squareIndex) => {
            const squareContainer = createSquareContainer();

            square.forEach((card, cardIndex) => {
                const cardElement = createCardElement(gameState, card, squareIndex, cardIndex);
                squareContainer.appendChild(cardElement);
            });

            gameBoard.appendChild(squareContainer);
        });
    }

    function createSquareContainer() {
        const squareContainer = document.createElement("div");
        squareContainer.classList.add("square");
        return squareContainer;
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

        addPhaseEventListeners(gameState, cardElement, squareIndex, cardIndex);

        return cardElement;
    }

    function addPhaseEventListeners(gameState, cardElement, squareIndex, cardIndex) {
        const phaseActions = {
            1: () => cardElement.addEventListener("click", () => revealCardPhase1(gameState, squareIndex, cardIndex, cardElement)),
            2: () => cardElement.addEventListener("click", () => selectCard(gameState, squareIndex, cardIndex, cardElement)),
            3: () => cardElement.addEventListener("click", () => revealCardPhase3(gameState, squareIndex, cardIndex, cardElement)),
        };

        if (phaseActions[gameState.phase]) phaseActions[gameState.phase]();
    }

    function updateCardDisplay(card, element) {
        card.revealed = true;
        element.textContent = `${card.number} ${card.suit}`;
        element.classList.remove("hidden");
        if (card.color === "red") element.classList.add("red");
    }

    // Révéler une carte (fonction appelée pendant la phase 1)
    function revealCardPhase1(gameState, squareIndex, cardIndex, element) {

        const card = gameState.boardSquares[squareIndex][cardIndex];

        if (!card.revealed && gameState.revealedCount[squareIndex] < 3) {
            updateCardDisplay(card, element)
            gameState.revealedCount[squareIndex]++;
        }

        // Vérifier si toutes les cartes sont révélées dans un carré
        if (gameState.revealedCount[squareIndex] === 3) {
            reglesDuJeu.textContent = `Carré ${squareIndex + 1} complété.`;

            if (gameState.revealedCount.every(count => count === 3)) {
                startPhase(gameState, 2);
            }
        }
    }

    function revealCardPhase3(gameState, squareIndex, cardIndex, element) {

        const card = gameState.boardSquares[squareIndex][cardIndex];

        if (!card.revealed && gameState.revealedCountPhase3 < 3) {
            updateCardDisplay(card, element)
            gameState.revealedCountPhase3++;
        }

        if (gameState.revealedCountPhase3 >= 3) {
            checkResults(gameState, reglesDuJeu);
        }
    }

    // Sélectionner une carte pour l'échange (phase 2)
    function selectCard(gameState, squareIndex, cardIndex, element) {

        const card = gameState.boardSquares[squareIndex][cardIndex];
        unselectCard(card);
        element.classList.add("selected");

        const cardPosition = { squareIndex, cardIndex, element };

        if (card.revealed) {
            gameState.selectedVisibleCard = cardPosition;
            reglesDuJeu.textContent = "Carte face visible sélectionnée. Sélectionnez une carte face cachée.";
        } else {
            gameState.selectedHiddenCard = cardPosition;
            reglesDuJeu.textContent = "Carte face cachée sélectionnée. Cliquez sur 'Passer à la phase 3' pour échanger.";
        }
    }

    // Unselect the card previously selected when selecting another
    function unselectCard(card) {

        const allCards = gameBoard.querySelectorAll(".card");

        allCards.forEach(cardElement =>
            ((cardElement.classList.contains("hidden") !== card.revealed) ? cardElement.classList.remove("selected") : null)
        );

    }

    function startPhase(gameState, phaseNumber) {
        const currentPhase = phases.find(p => p.phase === phaseNumber);

        gameState.phase = currentPhase.phase;
        reglesDuJeu.textContent = currentPhase.instructions;

        nextPhaseButton.style.display = currentPhase.showNextButton ? "inline-block" : "none";


        gameState.phase === 2 ? nextPhaseButton.addEventListener("click", () => startPhase(gameState, 3)) : nextPhaseButton.removeEventListener("click", () => startPhase(gameState, 3));
        // Gestion de l'échange de cartes en phase 3
        if (gameState.phase === 3) {
            swapCards(gameState);
        }

        renderBoard(gameState, phaseNumber);
    }

    // Fonction pour échanger les cartes
    function swapCards(gameState) {
        if (gameState.selectedVisibleCard && gameState.selectedHiddenCard) {
            const { squareIndex: visibleSquare, cardIndex: visibleIndex } = gameState.selectedVisibleCard;
            const { squareIndex: hiddenSquare, cardIndex: hiddenIndex } = gameState.selectedHiddenCard;

            [gameState.boardSquares[visibleSquare][visibleIndex], gameState.boardSquares[hiddenSquare][hiddenIndex]] =
                [gameState.boardSquares[hiddenSquare][hiddenIndex], gameState.boardSquares[visibleSquare][visibleIndex]];

            gameState.selectedVisibleCard = null;
            gameState.selectedHiddenCard = null;
        }
    }

    startButton.addEventListener("click", () => startGame());
});