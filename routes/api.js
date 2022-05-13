'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle, coordinate, value} = req.body;
      try {
        const failedChecks = solver.check(puzzle, coordinate, value);
        let result = {valid: true};
        if (failedChecks.length) {
          result = {
            valid: false,
            conflict: failedChecks
          };
        }
        
        return res.status(200).json(result);
      } catch (err) {
        return res.status(200).json({error: err.message});
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body;
      try {
        if (!puzzle) {
          throw new Error('Required field missing');
        }
        const solvedPuzzle = solver.solve(puzzle);
        return res.status(200).json({solution: solvedPuzzle});
      } catch (err) {
        return res.status(200).json({error: err.message});
      }
    });
};
