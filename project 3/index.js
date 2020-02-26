'use strict';

// Подключаем внешние библиотеки
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');

let questionsDir = 'questions'; // путь до директории с вопросами
let rightAnswersCount = 0; // счётчик правильных ответов

// Получаем массив файлов с вопросами
let questionFiles = fs.readdirSync(questionsDir).map(fileName => {
  return path.join(questionsDir, fileName);
});

// Выбираем 5 случайных элементов из массива и задаём вопрос пользователю
let randomQuestionsFiles = getRandomElements(questionFiles, 5);
randomQuestionsFiles.forEach(questionFile => {
  if ( askQuestion(questionFile) ) {
    rightAnswersCount++;
  }
})

console.log('Количество правильных ответов: ' + rightAnswersCount);

/**
 * Задаёт вопрос с вариантами ответа пользователю. 
 * Если ответ правильный возвращает true, иначе false
 * @param {string} filePath Путь до файла
 * @return {boolean}
 */
function askQuestion(filePath) {
  let data = fs.readFileSync(filePath, 'utf-8').split('\n');

  let question = data[0];
  let rightAnswerIndex = data[1];
  let answers = data.slice(2).map((item, key) => (key + 1) + ': ' + item)
    .join('\n');

  let userAnswer = +readlineSync.question(`${question}\n${answers}\n[1-4]: `);

  return userAnswer == rightAnswerIndex;
}

/**
 * Возвращает случайные элементы из массива
 * @param {array} arr Массив
 * @param {number} count Количество возвращаемых элементов
 * @return {array} Массив со случайными элементами
 */
function getRandomElements(arr, count) {
  let res = [];
  
  for (let i = 0; i < count; i++) {
    let key = Math.floor( Math.random() * arr.length );
    res.push( arr.splice(key, 1)[0] );
  }
  
  return res;
}





