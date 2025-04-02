const suits = ["♥", "♦", "♠", "♣"];

function generateAndShuffleDeck() {
    let deck = [];
    for (let i = 1; i <= 7; i++) {
        suits.forEach(suit => {
            const color = (suit === "♥" || suit === "♦") ? "red" : "black";
            deck.push({ number: i, suit, color, revealed: false });
        });
    }
    return shuffle(deck);
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function createVisibleCardElement(visibleCard, container) {
    container.innerHTML = "";

    const visibleCardElement = document.createElement("div");
    visibleCardElement.classList.add("card");
    visibleCardElement.textContent = `${visibleCard.number} ${visibleCard.suit}`;
    if (visibleCard.color === "red") visibleCardElement.classList.add("red");

    container.appendChild(visibleCardElement);
}

export function distributeCards(visibleCardContainer) {
    const deck = generateAndShuffleDeck();

    const visibleCard = deck.pop();

    createVisibleCardElement(visibleCard, visibleCardContainer);

    return [
        deck.slice(0, 9),
        deck.slice(9, 18),
        deck.slice(18, 27)
    ];
}