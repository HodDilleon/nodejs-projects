'use strict';

// Подключаем библиотеку для взаимодействия через консоль
const readlineSync = require('readline-sync');

let num = genNum(3, 6);
console.log('Я загадал число длиной ' + String(num).length);

let tries = +readlineSync.question('Оцени свои силы. За сколько попыток ты отгадаешь число? ');

while (tries > 0) {
  let userNum = +readlineSync.question('Назови число? ');

  if (num == userNum) {
    console.log('Правильно! А ты не плох...');
    break;
  }

  checkBullsCows(num, userNum);
  tries--;
}

if (tries == 0) {
  console.log('На этот раз тебе не повезло. В следующий раз старайся лучше');
}

/**
 * Проверяет числа по правилам игры "Быки и коровы" и выводит запись с кол-вом "быков" и "коров"
 * 
 * @param {number} num загаданное число
 * @param {number} userNum проверяемое число пользователя
 */
function checkBullsCows(num, userNum) {
  let bulls = 0;
  let cows = 0;
  num = String(num);
  userNum = String(userNum);
  
  for (let i = 0; i < userNum.length; i++) {
    if (num[i] == userNum[i]) {
      bulls++;
    }
  }

  for (let i of userNum) {
    if (num.includes(i)) {
      cows++;
    }
  }
  cows -= bulls;

  console.log(`Совпавших цифр не на своих местах - ${cows}, цифр на своих местах - ${bulls}`);
}

/**
 * Создает число длиной от min до max
 * 
 * @param {number} min 
 * @param {number} max 
 * @return {number}
 */
function genNum(min, max) {
  let nums = [0, 1, 2 ,3 ,4 ,5 ,6, 7, 8, 9];
  let res = '';

  let len = Math.floor( min + Math.random() * (max - min + 1) );

  for (let i = 0; i < len; i++) {
    let j = Math.floor(Math.random() * nums.length);
    res += nums[j];
    nums.splice(j, 1);    
  }

  return +res;
}