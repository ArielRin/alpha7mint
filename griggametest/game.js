document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 12;
    const blockSize = canvas.width / gridSize; // Assuming the canvas is square
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    let scoreA = 0;
    let scoreB = 0;

    function placeStartingBlock(team) {
        let row, col;
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: // Top edge
                row = 0;
                col = Math.floor(Math.random() * gridSize);
                break;
            case 1: // Right edge
                row = Math.floor(Math.random() * gridSize);
                col = gridSize - 1;
                break;
            case 2: // Bottom edge
                row = gridSize - 1;
                col = Math.floor(Math.random() * gridSize);
                break;
            case 3: // Left edge
                row = Math.floor(Math.random() * gridSize);
                col = 0;
                break;
        }
        grid[row][col] = team;
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === 1) ctx.fillStyle = "blue";
                else if (grid[row][col] === 2) ctx.fillStyle = "red";
                else ctx.fillStyle = "lightgrey";
                ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
                ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }

        // Display scores
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(`Team A Score: ${scoreA}`, 10, canvas.height - 30);
        ctx.fillText(`Team B Score: ${scoreB}`, 220, canvas.height - 30);
    }

    function updateScore(team) {
        if (team === 1) scoreA++;
        else scoreB++;
    }

    function isAdjacent(row, col) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        return directions.some(([dx, dy]) => {
            const newRow = row + dx, newCol = col + dy;
            return newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize && grid[newRow][newCol] !== 0;
        });
    }

    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevents the context menu on right-click
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const row = Math.floor(y / blockSize);
        const col = Math.floor(x / blockSize);
        const team = e.button === 0 ? 1 : e.button === 2 ? 2 : null; // Left-click: Team A, Right-click: Team B

        if (team && grid[row][col] === 0 && isAdjacent(row, col)) {
            grid[row][col] = team;
            updateScore(team);
            drawGrid();
        }
    });

    canvas.oncontextmenu = function (e) {
        e.preventDefault(); // Prevent the default context menu on right-click
    };

    // Place starting blocks and draw the initial grid
    placeStartingBlock(1); // Team A
    placeStartingBlock(2); // Team B
    drawGrid();
});
