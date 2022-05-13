const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();
let validPuzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let solvedPuzzleString = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';


suite('UnitTests', () => {
  
  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.throws(() => solver.check('too short puzzle string', 'A1', 7), Error, "Expected puzzle to be 81 characters long");
  });

  test('Logic handles a puzzle string with invalid characters', () => {
    assert.throws(() => solver.check(validPuzzleString.replace('.', '-'), 'A1', 7), Error, "Invalid characters in puzzle");
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    let result = solver.check(validPuzzleString, 'A1', 7);
    assert.isArray(result);
    assert.equal(result.length, 0);
  });

  test('Logic handles a valid row placement', () => {
    let result = solver.check(validPuzzleString, 'A1', 7);
    assert.isArray(result);
    assert.equal(result.length, 0);
  });
  
  test('Logic handles an invalid row placement', () => {
    let result = solver.check(validPuzzleString, 'A1', 9);
    assert.isArray(result);
    assert.include(result, 'row');
  });
  
  test('Logic handles a valid column placement', () => {
    let result = solver.check(validPuzzleString, 'A1', 7);
    assert.isArray(result);
    assert.equal(result.length, 0);
  });
  
  test('Logic handles an invalid column placement', () => {
    let result = solver.check(validPuzzleString, 'A1', 4);
    assert.isArray(result);
    assert.include(result, 'column');
  });
  
  test('Logic handles a valid region (3x3 grid) placement', () => {
    let result = solver.check(validPuzzleString, 'A1', 7);
    assert.isArray(result);
    assert.equal(result.length, 0);
  });
  
  test('Logic handles an invalid region (3x3 grid) placement', () => {
    let result = solver.check(validPuzzleString, 'A1', 9);
    assert.isArray(result);
    assert.include(result, 'region');
  });
  
  test('Valid puzzle strings pass the solver', () => {
    assert.equal(solver.solve(validPuzzleString), solvedPuzzleString);
  });
  
  test('Invalid puzzle strings fail the solver', () => {
    assert.throws(() => solver.solve(validPuzzleString.replace('.', '-')), Error, "Invalid characters in puzzle");
  });
  
  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.equal(solver.solve(validPuzzleString), solvedPuzzleString);
  });

});
