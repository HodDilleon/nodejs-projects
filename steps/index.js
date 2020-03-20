const { Given, Then } = require('cucumber');
const assert = require('assert');
const ticTacToe = require('../tic-tac-toe.js');

let isMoveOk;

Given('пустое поле', function () {
  ticTacToe.setField('000|000|000');
});

Given('поле {string}', function (string) {
  ticTacToe.setField(string);
});

Given('ходит игрок {int}', function (int) {
  ticTacToe.setActivePlayer(int);
});

Given('игрок ходит в клетку {int}, {int}', function (int, int2) {
  isMoveOk = ticTacToe.makeMove(int, int2);
});

Then('поле становится {string}', function (string) {
  assert.equal(ticTacToe.getField(), string);
});

Then('возвращается ошибка', function () {
  assert.equal(isMoveOk, false);
});

Then('победил игрок {int}', function (int) {
  let winner;
  if ( winner = ticTacToe.getWinner() ) {
    assert.equal(winner, int);
  }
});