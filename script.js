import { distributeCards } from "./modules/deck.js";
import { checkResults } from "./modules/checkResults.js";
import { visibleCardContainer, gameBoard, startButton, reglesDuJeu, nextPhaseButton, phases } from "./modules/constantes.js";

document.addEventListener("DOMContentLoaded", () => {

    let boardSquares = [[], [], []];
    let phase = 1;
    let revealedCount = [0, 0, 0]; // Nombre de cartes révélées par carré dans la phase 1
    let revealedCountPhase3 = 0; // Nombre de cartes révélées dans la phase 3
    let selectedVisibleCard = null; // Carte face visible sélectionnée pour échange
    let selectedHiddenCard = null; // Carte face cachée sélectionnée pour échange

    // Démarrer la partie
    function startGame() {
        // Reset values
        phase = 1;
        revealedCount = [0, 0, 0];
        revealedCountPhase3 = 0;
        selectedVisibleCard = null;
        selectedHiddenCard = null;
        visibleCardContainer.innerHTML = "";

        // Set New Cards
        boardSquares = distributeCards(visibleCardContainer);

        // Start phase 1
        startPhase(1);
    }

    function renderBoard() {
        gameBoard.innerHTML = "";

        boardSquares.forEach((square, squareIndex) => {
            const squareContainer = document.createElement("div");
            squareContainer.classList.add("square");

            square.forEach((card, cardIndex) => {
                const cardElement = document.createElement("div");
                cardElement.classList.add("card");

                // Update the visibility based on the 'revealed' property
                if (card.revealed) {
                    cardElement.textContent = `${card.number} ${card.suit}`;
                    if (card.color === "red") {
                        cardElement.classList.add("red");
                    }
                } else {
                    cardElement.classList.add("hidden");
                }

                cardElement.dataset.square = squareIndex;
                cardElement.dataset.index = cardIndex;

                // Phase 1
                if (phase === 1) {
                    cardElement.addEventListener("click", () => revealCardPhase1(squareIndex, cardIndex, cardElement));
                }

                // Phase 2
                if (phase === 2) {
                    cardElement.addEventListener("click", () => selectCard(squareIndex, cardIndex, cardElement));
                }

                // Phase 3
                if (phase === 3) {
                    cardElement.addEventListener("click", () => revealCardPhase3(squareIndex, cardIndex, cardElement));
                }

                squareContainer.appendChild(cardElement);
            });

            gameBoard.appendChild(squareContainer);
        });
    }

    // Révéler une carte (fonction appelée pendant la phase 1)
    function revealCardPhase1(squareIndex, cardIndex, element) {

        if (phase !== 1) return;

        const card = boardSquares[squareIndex][cardIndex];

        if (!card.revealed && revealedCount[squareIndex] < 3) {
            card.revealed = true;
            element.textContent = `${card.number} ${card.suit}`;
            element.classList.remove("hidden");
            if (card.color === "red") element.classList.add("red");
            revealedCount[squareIndex]++;
        }

        // Vérifier si toutes les cartes sont révélées dans un carré
        if (revealedCount[squareIndex] === 3) {
            reglesDuJeu.textContent = `Carré ${squareIndex + 1} complété.`;
            checkPhase1Completion(); // Vérifier si la phase 1 est terminée
        }
    }

    function revealCardPhase3(squareIndex, cardIndex, element) {
        if (phase !== 3) return;
        const card = boardSquares[squareIndex][cardIndex];

        if (!card.revealed && revealedCountPhase3 < 3) {
            card.revealed = true;
            element.textContent = `${card.number} ${card.suit}`;
            element.classList.remove("hidden");
            if (card.color === "red") element.classList.add("red");
            revealedCountPhase3++;
        }

        if (revealedCountPhase3 === 3) {
            checkPhase3Completion();
        }
    }

    // Vérifier si tous les carrés sont complets pour passer à la phase 2
    function checkPhase1Completion() {
        if (revealedCount.every(count => count === 3)) {
            reglesDuJeu.textContent = "Phase 1 terminée ! Passons à la phase 2.";
            startPhase(2);
        }
    }

    function checkPhase3Completion() {
        if (revealedCountPhase3 >= 3) {
            checkResults(boardSquares, reglesDuJeu);
        }
    }

    // Sélectionner une carte pour l'échange (phase 2)
    function selectCard(squareIndex, cardIndex, element) {
        if (phase !== 2) return;

        const card = boardSquares[squareIndex][cardIndex];
        unselectCard(card);
        element.classList.add("selected");

        const cardPosition = { squareIndex, cardIndex, element };

        if (card.revealed) {
            selectedVisibleCard = cardPosition;
            reglesDuJeu.textContent = "Carte face visible sélectionnée. Sélectionnez une carte face cachée.";
        } else {
            selectedHiddenCard = cardPosition;
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

    function startPhase(phaseNumber) {
        const currentPhase = phases.find(p => p.phase === phaseNumber);

        phase = currentPhase.phase;
        reglesDuJeu.textContent = currentPhase.instructions;

        nextPhaseButton.style.display = currentPhase.showNextButton ? "inline-block" : "none";

        // Gestion de l'échange de cartes en phase 3
        if (phase === 3) {
            swapCards();
        }

        renderBoard();
    }

    // Fonction pour échanger les cartes
    function swapCards() {
        if (selectedVisibleCard && selectedHiddenCard) {
            const { squareIndex: visibleSquare, cardIndex: visibleIndex } = selectedVisibleCard;
            const { squareIndex: hiddenSquare, cardIndex: hiddenIndex } = selectedHiddenCard;

            [boardSquares[visibleSquare][visibleIndex], boardSquares[hiddenSquare][hiddenIndex]] =
                [boardSquares[hiddenSquare][hiddenIndex], boardSquares[visibleSquare][visibleIndex]];

            selectedVisibleCard = null;
            selectedHiddenCard = null;
        }
    }

    startButton.addEventListener("click", () => startGame());
    nextPhaseButton.addEventListener("click", () => startPhase(3));
});