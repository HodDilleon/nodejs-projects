'use strict';
const readlineSync = require('readline-sync');

let field = '000|000|000';
let activePlayer = 1;

/**
 * Сыграть игру
 */
function play() {
  while(true) {
    console.log(`Поле выглядит так: ${field}. Ходит игрок ${activePlayer}`);

    let x, y; // Координаты куда ходит игрок
    do {
      [x, y] = getMove();
    } while ( !makeMove(x, y) );

    let winner;
    if ( winner = getWinner() ) {
      console.log(`Выиграл игрок ${winner}`);
      break;
    }

  }
}

/**
 * Запрость у игрока через консоль координаты куда ходить
 * 
 * @return { number[] }
 */
function getMove() {
  let isInputWrong = true;
  do {
    let yourMove = readlineSync.question('Куда сходим? (Введите два значения через запятую): ');
    let [x, y] = yourMove.split(',');

    let correctVals = [1, 2, 3];
    if ( correctVals.includes(+x) && correctVals.includes(+y) ) {
      return [+x, +y];
    }
  } while ( isInputWrong );
}

/**
 * Делаем ход на поле, устанавливая значения. 
 * Если поле уже занято, то возвращаем false. Если всё успешно, то true
 * 
 * @param {number} a номер столбца 
 * @param {number} b номер строки
 * @return {boolean}
 */
function makeMove(a, b) {
  let fieldRows = field.split('|');

  if (fieldRows[b-1][a-1] !== '0') {
    return false;
  }

  switch (a) {
    case 1:
      fieldRows[b-1] = activePlayer + fieldRows[b-1][1] + fieldRows[b-1][2]; 
      break;
    case 2:
      fieldRows[b-1] = fieldRows[b-1][0] + activePlayer + fieldRows[b-1][2]; 
      break;
    case 3:
      fieldRows[b-1] = fieldRows[b-1][0] + fieldRows[b-1][1] + activePlayer; 
      break;
  }

  field = fieldRows.join('|');
  changePlayer();
  return true;
}

/**
 * Проверить победил ли какой-то игрок. Если да, то возвращает его номер. В противном случае false
 * @return { (number|false) }
 */
function getWinner() {
  let fieldRows = field.split('|');

  for (let i = 0; i < 3; i++) {
    // Проверяем вертикали
    if ((fieldRows[0][i] === fieldRows[1][i] && fieldRows[1][i] === fieldRows[2][i])
    && fieldRows[1][i] !== '0') return fieldRows[2][i];  

    // Проверяем горизонтали
    if ((fieldRows[i][0] === fieldRows[i][1] && fieldRows[i][1] === fieldRows[i][2])
    && fieldRows[i][0] !== '0') return fieldRows[i][2];      
  }

  // Проверяем 1-ую диагональ
  if ((fieldRows[0][0] === fieldRows[1][1] && fieldRows[1][1] === fieldRows[2][2])
  && fieldRows[1][1] !== '0') return fieldRows[1][1];  

  // Проверяем 2-ую диагональ
  if ((fieldRows[2][0] === fieldRows[1][1] && fieldRows[1][1] === fieldRows[0][2])
  && fieldRows[1][1] !== '0') return fieldRows[1][1];  

  return false;
}

/**
 * Сменить номер активного игрока (1 или 2)
 */
function changePlayer() {
  activePlayer = (activePlayer == 1 ? 2 : 1);
}

/**
 * Получить значение поле
 * @return {string}
 */
function getField() {
  return field;
}

/**
 * Устанавливает новое значение для поля
 * 
 * @param {string} val поле в формате 000|000|000
 */
function setField(val) {
  field = val;
}

/**
 * Устанавливает новое значение для активного игрока
 * 
 * @param {number} val номер игрока 
 */
function setActivePlayer(val) {
  activePlayer = val;
}

module.exports = { makeMove, getWinner, getField, setField, setActivePlayer, play };