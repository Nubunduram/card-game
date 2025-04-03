export function test(checkLine) {
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