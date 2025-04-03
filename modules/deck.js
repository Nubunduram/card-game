function generateDeck() {
    const suits = ["♥", "♦", "♠", "♣"];
    
    return suits.flatMap(suit => {

        const color = (suit === "♥" || suit === "♦") ? "red" : "black";

        return Array.from({ length: 7 }, (_, i) => {
            return {
                number: i + 1,
                suit,
                color,
                revealed: false,
                selected: false,
                index: null,
                squareIndex: null,
            };
        });
    });
}

function shuffle(deck) {
    return deck.sort(() => Math.random() - 0.5);
}

function createVisibleCardElement(visibleCard) {
    const visibleCardElement = document.createElement("div");
    visibleCardElement.classList.add("card");
    visibleCardElement.textContent = `${visibleCard.number} ${visibleCard.suit}`;
    if (visibleCard.color === "red") visibleCardElement.classList.add("red");
    return visibleCardElement;
}

export function distributeCards(gameElements) {

    const deck = shuffle(generateDeck());
    const visibleCard = deck.pop();

    gameElements.visibleCardContainer.innerHTML = "";
    gameElements.visibleCardContainer.appendChild(createVisibleCardElement(visibleCard));

    return [
        deck.slice(0, 9).map((card, index) => ({ ...card, squareIndex: 0, index })),
        deck.slice(9, 18).map((card, index) => ({ ...card, squareIndex: 1, index })),
        deck.slice(18, 27).map((card, index) => ({ ...card, squareIndex: 2, index }))
    ];
}