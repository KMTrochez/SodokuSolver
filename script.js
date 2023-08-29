const boardSize = 9;
const sudokuBoard = document.getElementById("sudoku-board");

for (let i = 0; i < boardSize; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.id = `cell-${i}-${j}`;
        input.classList.add("sudoku-input"); // Add the class here
        cell.appendChild(input);
        row.appendChild(cell);
    }
    sudokuBoard.appendChild(row);
}

// Function to check if it's safe to place 'num' in 'board' at position (row, col)
function isSafe(board, row, col, num) {
    // Check if 'num' is not present in the current row, current column, and current 3x3 subgrid
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num || board[row - row % 3 + Math.floor(i / 3)][col - col % 3 + i % 3] === num) {
            return false;
        }
    }
    return true;
}

// Backtracking Sudoku solver function
function solveSudoku(board) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        return true; // No empty cells left, solution found
    }
    
    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            
            if (solveSudoku(board)) {
                return true; // Move to the next empty cell
            }
            
            board[row][col] = 0; // Backtrack
        }
    }

    return false; // No valid number found, need to backtrack
}

// Helper function to find an empty cell
function findEmptyCell(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null; // No empty cell found
}

// Function to validate input values
function isValidInput(input){
    return (input ==="" || (input >=1 && input <= 9));
}

// Function to start solving when the Solve button is clicked
const solveButton = document.getElementById("solve-button");
solveButton.addEventListener("click", () => {
    const board = [];
    let isValidInput = true;

    // Populate the 'board' array with input values (0 for empty cells)
    for (let i = 0; i < 9; i++) {
        board[i] = [];
        for (let j = 0; j < 9; j++) {
            const inputId = `cell-${i}-${j}`;
            const inputElement = document.getElementById(inputId);
            const inputValue = inputElement.value.trim(); // Remove leading/trailing spaces

            if (/^[1-9]$/.test(inputValue) || inputValue === "") {
                board[i][j] = inputValue === "" ? 0 : parseInt(inputValue);
                inputElement.classList.remove("input-error"); // Remove error styling
            } else {
                isValidInput = false;
                board[i][j] = 0; //clear the cell value
                inputElement.value = ""; // Clear the input value
                inputElement.classList.add("input-error"); // Apply error styling
            }
        }
    }

    // Remove error styling from all input elements
    const inputElements = document.querySelectorAll(".sudoku-input input");
    inputElements.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
        inputElement.classList.remove("input-error");
        document.getElementById("error-message").textContent = ""; // Clear error message
    });
});

    if(isValidInput){
        if (solveSudoku(board)) {
            // Populate the input fields with the solved values
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const inputId = `cell-${i}-${j}`;
                    document.getElementById(inputId).value = board[i][j];
                }
            }
        } else {
            alert("No solution exists!");
        }
    } else {
        document.getElementById("error-message").textContent = "Please input only numbers (1-9) or leave the cell empty.";
    }
        
});


// Function to clear the Sudoku board
function clearBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const inputId = `cell-${i}-${j}`;
            document.getElementById(inputId).value = "";
        }
    }
}

// Event listener for the Clear button
const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", clearBoard);
