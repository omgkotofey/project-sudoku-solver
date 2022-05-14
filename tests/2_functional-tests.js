const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validPuzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let solvedPuzzleString = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

const buildUrl = (url) => {
  return `/api/${url}`;
}

suite('Functional Tests', () => {
  
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post(buildUrl('solve'))
      .type('form')
      .send({
        puzzle: validPuzzleString
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, solvedPuzzleString);
        done();
      });
  });
  
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post(buildUrl('solve'))
      .type('form')
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });
  
  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post(buildUrl('solve'))
      .type('form')
      .send({
        puzzle: validPuzzleString.replace('.', '-')
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  
  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post(buildUrl('solve'))
      .type('form')
      .send({
        puzzle: validPuzzleString.substr(1)
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post(buildUrl('solve'))
      .type('form')
      .send({
        puzzle: '9' + validPuzzleString.substring(1)
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });
  
  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post(buildUrl('check'))
      .type('form')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A1',
        value: 7
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });
  
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post(buildUrl('check'))
      .type('form')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'B1',
        value: 6
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        assert.include(res.body.conflict, 'column');
        done();
      });
  });
  
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post(buildUrl('check'))
      .type('form')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A1',
        value: 4
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });
  
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post(buildUrl('check'))
      .type('form')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A1',
        value: 5
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });
  
  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post(buildUrl('check'))
      .type('form')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A1',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });
  
  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post(buildUrl('check'))
      .type('form')
      .send({
        puzzle: validPuzzleString.replace('.', '-'),
        coordinate: 'A1',
        value: 9
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  
  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post(buildUrl('check'))
      .type('form')
      .send({
        puzzle: validPuzzleString.substr(1),
        coordinate: 'A1',
        value: 9
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post(buildUrl('check'))
      .type('form')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'Z100',
        value: 9
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });
  
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post(buildUrl('check'))
      .type('form')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A1',
        value: 'foo'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });

});

