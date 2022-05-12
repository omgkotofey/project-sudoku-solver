class SudokuSolver {

  _validatePuzzleString(puzzleString) {
    if (puzzleString.length === 0) {
      throw new Error('Required field missing');
    }
  
    if (puzzleString.length !== 81) {
      throw new Error('Expected puzzle to be 81 characters long');
    }

    if (!/^[0-9.]*$/.test(puzzleString)) {
        throw new Error('Invalid characters in puzzle');
    }

    return true;
  }

  _parseValue(value) {
    if (!value) {
       throw new Error('Required field(s) missing');
    }
    if (!/^[1-9]$/.test(value)) {
       throw new Error('Invalid value');
    }
    
    return value;
  }

  _parseCoordFromInput(coordInput) {
    if (!coordInput) {
      throw new Error('Required field(s) missing');
    }

    if (!/^[A-I][1-9]{1,2}$/.test(coordInput)) {
       throw new Error('Invalid value');
    }

    return {
      row: coordInput[0].charCodeAt() - 65, // 65 is 'A' letter char code
      col: parseInt(coordInput.slice(1)) - 1 // all rows starts from zero index
    }
  }

  _buildTableFromString(puzzleString) {
    const table = [];
    const rows = puzzleString.match(/.{1,9}/g);

    rows.forEach((rowString, rowIndex) => {
      rowString.split('').forEach((colSymbol, colIndex) => {
        if (!table[rowIndex]) {
          table[rowIndex] = [];
        }
        table[rowIndex][colIndex] = colSymbol == '.' ? 0 : parseInt(colSymbol);
      })
    })

    return table;
  }

  _buildStringFromTable(puzzleTable) {
    let puzzleString = '';

    for (let row = 0; row < 9; row++) {
      for (var col = 0; col < 9; col++) {
        puzzleString += puzzleTable[row][col] ? puzzleTable[row][col] : '.';
      }
    }
    
    return puzzleString;
  }

  _checkRowPlacement(board, row, column, value) {
    for (let col = 0; col < 9; col++) {
        if (board[row][col] == value) {
            throw new Error('Conflict!')
        }
    }

    return true;
  }

  _checkColPlacement(board, row, column, value) {
    for (let row = 0; row < 9; row++) {
        if (board[row][column] == value) {
            throw new Error('Conflict!')
        }
    }

    return true;
  }

  _checkRegionPlacement(board, row, column, value) {
      let regionStartRow = parseInt(row / 3) * 3;
      let regionStartCol = parseInt(column / 3) * 3;
    
      for (let row = regionStartRow; row < regionStartRow + 3; row++) {
          for (let col = regionStartCol; col < regionStartCol + 3; col++) {
              if (board[row][col] == value) {
                  throw new Error('Conflict!')
              }
          }
      }
      
    return true;
  }

  _checkPlacement(board, row, col, value) {
    const checks = {
      'row': this._checkRowPlacement,
      'col': this._checkColPlacement,
      'region': this._checkRegionPlacement
    }
    const failedChecks = [];

    for (let [checkName, checkFn] of Object.entries(checks)) {
      try {
        checkFn(board, row, col, value); 
      } catch (err) {
        failedChecks.push(checkName);
      }
    }

    return failedChecks;
  }

  check(puzzleString, coordInput, value) {
    this._validatePuzzleString(puzzleString);
    const { row, col } = this._parseCoordFromInput(coordInput);
    const parsedValue = this._parseValue(value);
    const board = this._buildTableFromString(puzzleString);
    
    return this._checkPlacement(board, row, col, value);
  }

  _solveSudoku(board, row = 0, col = 0) {
    if (row == 8 && col == 9) {
      return true;
    }

    if (col == 9) {
        row++;
        col = 0;
    }

    if (board[row][col] != 0) {
       return this._solveSudoku(board, row, col + 1);
    }

    for (let value = 1; value <= 9; value++) {
        let conflicts = this._checkPlacement(board, row, col, value);
        if (!conflicts.length) {
            board[row][col] = value;
            if (this._solveSudoku(board, row, col + 1)) {
              return true;
            }
        }
        board[row][col] = 0;
    }
    
    return false;
  }

  solve(puzzleString) {
    this._validatePuzzleString(puzzleString);
    const board = this._buildTableFromString(puzzleString);
    this._solveSudoku(board);
    
    return this._buildStringFromTable(board);
  }
}

module.exports = SudokuSolver;

