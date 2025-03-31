document.addEventListener("DOMContentLoaded", () => {
    const visibleCardContainer = document.getElementById("off-card");
    const gameBoard = document.getElementById("game-board");
    const startButton = document.getElementById("start-game");
    const reglesDuJeu = document.getElementById("regles-du-jeu");
    const nextPhaseButton = document.getElementById("next-phase"); // Bouton pour passer à la phase 3
    let deck = [];
    let boardSquares = [[], [], []];
    let visibleCard = null;
    const suits = ["♥", "♦", "♠", "♣"];
    let phase = 1; // Phase actuelle
    let revealedCount = [0, 0, 0]; // Nombre de cartes révélées par carré
    let selectedVisibleCard = null; // Carte face visible sélectionnée
    let selectedHiddenCard = null; // Carte face cachée sélectionnée
    let revealedCountPhase3 = 0;

    // Générer un deck de cartes
    function generateDeck() {
        deck = [];
        for (let i = 1; i <= 7; i++) {
            suits.forEach(suit => {
                const color = (suit === "♥" || suit === "♦") ? "red" : "black";
                deck.push({ number: i, suit, color, revealed: false });
            });
        }
        deck = shuffle(deck);
    }

    // Mélanger le deck
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Distribuer les cartes : 1 carte visible + 3 carrés de 9 cartes cachées
    function distributeCards() {
        visibleCard = deck.pop();
        boardSquares = [
            deck.splice(0, 9),
            deck.splice(0, 9),
            deck.splice(0, 9)
        ];

    }

    // Démarrer la partie
    function startGame() {
        // Reset values
        phase = 1;
        revealedCount = [0, 0, 0];
        revealedCountPhase3 = 0;
        selectedVisibleCard = null;
        selectedHiddenCard = null;

        // Clear UI
        gameBoard.innerHTML = "";
        visibleCardContainer.innerHTML = "";
        reglesDuJeu.textContent = "";

        // Reset deck and distribute cards
        generateDeck();
        distributeCards();

        // Render the new board
        renderBoard();

        // Start phase 1
        startPhase1();
    }

    // Afficher la carte visible et les 3 carrés de 3x3 cartes cachées
    function renderBoard() {
        gameBoard.innerHTML = "";
        visibleCardContainer.innerHTML = "";

        const visibleCardElement = document.createElement("div");
        visibleCardElement.classList.add("card");
        visibleCardElement.textContent = `${visibleCard.number} ${visibleCard.suit}`;
        if (visibleCard.color === "red") visibleCardElement.classList.add("red");
        visibleCardContainer.appendChild(visibleCardElement);

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

                // Laisser l'événement de révélation actif pendant la phase 1
                if (phase === 1) {
                    cardElement.addEventListener("click", () => revealCardPhase1(squareIndex, cardIndex, cardElement));
                }

                // L'ajout de la possibilité de sélectionner dans la phase 2
                if (phase === 2) {
                    cardElement.addEventListener("click", () => selectCard(squareIndex, cardIndex, cardElement));
                }


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
        if (phase !== 1) return; // Ne permettre de révéler que pendant la phase 1 & 3
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
            startPhase2(); // Passer automatiquement à la phase 2
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

    // Démarrer la phase 1
    function startPhase1() {
        phase = 1;
        revealedCount = [0, 0, 0]; // Réinitialiser le nombre de cartes révélées
        reglesDuJeu.textContent = "Phase 1 : Retournez 3 cartes dans chaque carré.";
        nextPhaseButton.style.display = "none"; // Cacher le bouton de passage à la phase 3 pendant la phase 1
    }

    // Démarrer la phase 2
    function startPhase2() {
        nextPhaseButton.style.display = "inline-block";
        phase = 2;
        reglesDuJeu.textContent = "Phase 2 (optionnel) : Sélectionnez une carte visible et une carte cachée pour échanger leurs positions.";
        renderBoard(); // Re-rendre le tableau pour réinitialiser les événements et l'affichage
    }

    // Passer à la phase suivante (Phase 3)
    function startPhase3() {
        nextPhaseButton.style.display = "none"; // Cacher le bouton de passage à la phase 3 pendant la phase 2

        if (selectedVisibleCard && selectedHiddenCard) {
            // Si les cartes ont été sélectionnées, échanger les cartes sélectionnées
            const { squareIndex: visibleSquare, cardIndex: visibleIndex } = selectedVisibleCard;
            const { squareIndex: hiddenSquare, cardIndex: hiddenIndex } = selectedHiddenCard;

            // Échanger les cartes
            const temp = boardSquares[visibleSquare][visibleIndex];
            boardSquares[visibleSquare][visibleIndex] = boardSquares[hiddenSquare][hiddenIndex];
            boardSquares[hiddenSquare][hiddenIndex] = temp;



            // Réinitialiser la sélection
            selectedVisibleCard = null;
            selectedHiddenCard = null;
        }

        phase = 3;
        reglesDuJeu.textContent = " Découvrez 3 nouvelles cartes.";
        nextPhaseButton.style.display = "none"; // Cacher le bouton pour passer à la phase 3
        renderBoard();
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


    function test() {
        const testLine1 = [
            { number: 5, suit: "♥", color: "red", revealed: true },
            { number: 5, suit: "♦", color: "red", revealed: true },
            { number: 5, suit: "♠", color: "black", revealed: true }
        ];
        const testLine2 = [
            { number: 1, suit: "♥", color: "red", revealed: true },
            { number: 2, suit: "♥", color: "red", revealed: true },
            { number: 3, suit: "♥", color: "red", revealed: true }
        ];
        const testLine3 = [
            { number: 1, suit: "♥", color: "red", revealed: true },
            { number: 2, suit: "♦", color: "red", revealed: true },
            { number: 3, suit: "♦", color: "red", revealed: true }
        ];
        const testLine4 = [
            { number: 1, suit: "♠", color: "black", revealed: true },
            { number: 2, suit: "♠", color: "black", revealed: true },
            { number: 3, suit: "♣", color: "black", revealed: true }
        ];
        const testLine5 = [
            { number: 1, suit: "♠", color: "black", revealed: true },
            { number: 2, suit: "♠", color: "black", revealed: true },
            { number: 3, suit: "♦", color: "red", revealed: true }
        ];
        const testLine6 = [
            { number: 1, suit: "♥", color: "red", revealed: true },
            { number: 2, suit: "♦", color: "red", revealed: true },
            { number: 3, suit: "♦", color: "red", revealed: true }
        ];
        const testLine7 = [
            { number: 5, suit: "♦", color: "red", revealed: true },
            { number: 5, suit: "♦", color: "red", revealed: true },
            { number: 5, suit: "♦", color: "red", revealed: false }
        ];

        console.log(checkLine(testLine1) + " should be 5"); // Debug this manually
        console.log(checkLine(testLine2) + " should be 3"); // Debug this manually
        console.log(checkLine(testLine3) + " should be 1"); // Debug this manually
        console.log(checkLine(testLine4) + " should be 1"); // Debug this manually
        console.log(checkLine(testLine5) + " should be 0"); // Debug this manually
        console.log(checkLine(testLine6) + " should be 1"); // Debug this manually
        console.log(checkLine(testLine7) + " should be 0"); // Debug this manually

    }
    test()
    // Démarrer le jeu
    startButton.addEventListener("click", startGame);

    // Passer à la phase suivante (Phase 3)
    nextPhaseButton.addEventListener("click", startPhase3);
});