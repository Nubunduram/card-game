// Fonction pour vérifier une ligne (horizontale, verticale, ou diagonale)
function checkLine(cards) {
    if (cards.some(card => !card.revealed)) return 0; // Ne pas compter si une carte est cachée

    const [colors, numbers, suits] = ['color', 'number', 'suit'].map(attr => new Set(cards.map(card => card[attr])));

    // 3 Points pour les suits, 1 point pour la couleur (Les 2 ne se cumule pas) + 5 points pour les numbers 
    let points = (suits.size === 1 ? 3 : colors.size === 1 ? 1 : 0) + (numbers.size === 1 ? 5 : 0);

    return points;
}

// Fonction pour vérifier les résultats à la fin du jeu
export function checkResults(gameState, gameElements) {
    gameState.phase = 4;

    let totalPoints = 0;

    gameState.boardSquares.forEach(square => {

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
    gameElements.reglesDuJeu.textContent = totalPoints > 0
        ? `Vous avez gagné avec ${totalPoints} points !`
        : "Aucune ligne valide, vous avez perdu.";
}