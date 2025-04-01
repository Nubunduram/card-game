import { distributeCards } from "./modules/deck.js";

document.addEventListener("DOMContentLoaded", () => {
    // DOM
    const visibleCardContainer = document.getElementById("off-card");
    const gameBoard = document.getElementById("game-board");
    const startButton = document.getElementById("start-game");
    const reglesDuJeu = document.getElementById("regles-du-jeu");
    const nextPhaseButton = document.getElementById("next-phase");

    const phases = [
        {
            phase: 1,
            instructions: "Phase 1 : Retournez 3 cartes dans chaque carré.",
            showNextButton: false
        },
        {
            phase: 2,
            instructions: "Phase 2 (optionnel) : Sélectionnez une carte visible et une carte cachée pour échanger leurs positions.",
            showNextButton: true
        },
        {
            phase: 3,
            instructions: "Découvrez 3 nouvelles cartes.",
            showNextButton: false
        }
    ];

    let boardSquares = [[], [], []];
    let phase = 1; // Phase actuelle
    let revealedCount = [0, 0, 0]; // Nombre de cartes révélées par carré
    let selectedVisibleCard = null; // Carte face visible sélectionnée
    let selectedHiddenCard = null; // Carte face cachée sélectionnée
    let revealedCountPhase3 = 0;

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
            reglesDuJeu.textContent = "Phase 3 terminée ! Vérifions les résultats";
            checkResults();
        }
    }

    // Sélectionner une carte pour l'échange (phase 2)
    function selectCard(squareIndex, cardIndex, element) {
        if (phase !== 2) return; // Ne permettre de sélectionner que pendant la phase 2

        const card = boardSquares[squareIndex][cardIndex];

        const allCards = gameBoard.querySelectorAll(".card");
        allCards.forEach(cardElement => {
            if (cardElement.classList.contains("hidden") && !card.revealed) {
                cardElement.classList.remove("selected");
            } else if (!cardElement.classList.contains("hidden") && card.revealed) {
                cardElement.classList.remove("selected");
            }
        });

        // Si c'est la première carte visible sélectionnée
        if (card.revealed) {
            selectedVisibleCard = { squareIndex, cardIndex, element };
            element.classList.add("selected");
            reglesDuJeu.textContent = "Carte face visible sélectionnée. Sélectionnez une carte face cachée.";
        }
        // Si une carte cachée est sélectionnée
        else if (!card.revealed) {
            selectedHiddenCard = { squareIndex, cardIndex, element };
            element.classList.add("selected");
            reglesDuJeu.textContent = "Carte face cachée sélectionnée. Cliquez sur 'Passer à la phase 3' pour échanger.";
        }
    }

    function startPhase(phaseNumber) {
        const currentPhase = phases.find(p => p.phase === phaseNumber);

        phase = currentPhase.phase;
        reglesDuJeu.textContent = currentPhase.instructions;

        nextPhaseButton.style.display = currentPhase.showNextButton ? "inline-block" : "none";

        // Gestion de l'échange de cartes en phase 3
        if (phase === 3 && selectedVisibleCard && selectedHiddenCard) {
            swapCards();
        }

        renderBoard();
    }

    // Fonction pour échanger les cartes
    function swapCards() {
        const { squareIndex: visibleSquare, cardIndex: visibleIndex } = selectedVisibleCard;
        const { squareIndex: hiddenSquare, cardIndex: hiddenIndex } = selectedHiddenCard;

        [boardSquares[visibleSquare][visibleIndex], boardSquares[hiddenSquare][hiddenIndex]] =
            [boardSquares[hiddenSquare][hiddenIndex], boardSquares[visibleSquare][visibleIndex]];

        selectedVisibleCard = null;
        selectedHiddenCard = null;
    }

    // Fonction pour vérifier les résultats à la fin du jeu
    function checkResults() {
        let totalPoints = 0;

        boardSquares.forEach(square => {
            const lines = [
                // Lignes
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                // Colonnes
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                // Diagonales
                [0, 4, 8], [2, 4, 6]
            ];

            totalPoints += lines.reduce((sum, indices) => sum + checkLine(indices.map(i => square[i])), 0);
        });

        // Affichage du résultat
        reglesDuJeu.textContent = totalPoints > 0
            ? `Vous avez gagné avec ${totalPoints} points !`
            : "Aucune ligne valide, vous avez perdu.";
    }

    // Fonction pour vérifier une ligne (horizontale, verticale, ou diagonale)
    function checkLine(cards) {
        if (cards.some(card => !card.revealed)) return 0; // Ne pas compter si une carte est cachée

        const [colors, numbers, suits] = ['color', 'number', 'suit'].map(attr => new Set(cards.map(card => card[attr])));

        let points = (suits.size === 1 ? 3 : colors.size === 1 ? 1 : 0) + (numbers.size === 1 ? 5 : 0);

        return points;
    }

    // Démarrer le jeu
    startButton.addEventListener("click", () => startGame());
    nextPhaseButton.addEventListener("click", () => startPhase(3));
});