'use strict';

// Подключаем библиотеку для взаимодействия через консоль
const readlineSync = require('readline-sync');

const monster = {
  maxHealth: 10,
  name: "Лютый",
  moves: [
    {
      "name": "Удар когтистой лапой",
      "physicalDmg": 3, // физический урон
      "magicDmg": 0,    // магический урон
      "physicArmorPercents": 20, // физическая броня
      "magicArmorPercents": 20,  // магическая броня
      "cooldown": 0,     // ходов на восстановление
      "turnsOnCooldown": 0
    },
    {
      "name": "Огненное дыхание",
      "physicalDmg": 0,
      "magicDmg": 4,
      "physicArmorPercents": 0,
      "magicArmorPercents": 0,
      "cooldown": 3,
      "turnsOnCooldown": 0
    },
    {     
      "name": "Удар хвостом",
      "physicalDmg": 2,
      "magicDmg": 0,
      "physicArmorPercents": 50,
      "magicArmorPercents": 0,
      "cooldown": 2,
      "turnsOnCooldown": 0
    },
  ]
}

const hero = {
  name: "Евстафий",
  moves: [
    {
      "name": "Удар боевым кадилом",
      "physicalDmg": 2,
      "magicDmg": 0,
      "physicArmorPercents": 0,
      "magicArmorPercents": 50,
      "cooldown": 0,
      "turnsOnCooldown": 0
    },
    {
      "name": "Вертушка левой пяткой",
      "physicalDmg": 4,
      "magicDmg": 0,
      "physicArmorPercents": 0,
      "magicArmorPercents": 0,
      "cooldown": 4,
      "turnsOnCooldown": 0
    },
    {
      "name": "Каноничный фаербол",
      "physicalDmg": 0,
      "magicDmg": 5,
      "physicArmorPercents": 0,
      "magicArmorPercents": 0,
      "cooldown": 3,
      "turnsOnCooldown": 0
    },
    {
      "name": "Магический блок",
      "physicalDmg": 0,
      "magicDmg": 0,
      "physicArmorPercents": 100,
      "magicArmorPercents": 100,
      "cooldown": 4,
      "turnsOnCooldown": 0
    },
  ]
}

// Запрашиваем уровень здоровья (сложность игры)
let hp = +readlineSync.question('Укажи свой уровень здоровья? ');
hero.health = hero.maxHealth = hp;
monster.health = monster.maxHealth;

while (true) {
  let monsterMove = chooseRandomMove(monster);

  // Сообщаем игроку удар монстра и запрашиваем у у него какой будет ответный удар
  let heroActiveMoves = hero.moves.filter(item => item.turnsOnCooldown == 0);
  let msgForUser = heroActiveMoves.map((item, key) => key + ' - ' + item.name).join('\n');
  let heroMove;
  do {
    let moveIndex = +readlineSync.question(`Монстр атакует. Похоже это: ${monsterMove.name}. Как бьём в ответ?\n${msgForUser}\n`);
    heroMove = heroActiveMoves[moveIndex];
  } while (!heroMove);

  makeStrike(monster, monsterMove, hero, heroMove);
  console.log(`Твоё здоровье: ${hero.health}. Здоровье монстра: ${monster.health}.`)

  // Кто-нибудь умер?
  if (isDead(monster) && isDead(hero)) {
    console.log('Последний удар был смертельным для обоих');
    break;
  }
  if (isDead(monster)) {
    console.log('Ура! Победа!');
    break;
  }
  if (isDead(hero)) {
    console.log('Враг оказался сильней...');
    break;
  }
  
  refreshCooldowns(hero, monster);
  setCooldown(hero, heroMove);
  setCooldown(monster, monsterMove);
}

/**
 * Выбираем случайным убразом удар среди тех, которые не на cooldown'е 
 * @param {object} unit Юнит (монстр или игрок)
 * @return {object} Удар
 */
function chooseRandomMove(unit) {
  let activeMoves = unit.moves.filter(item => item.turnsOnCooldown == 0);
  return activeMoves[ Math.floor(Math.random() * activeMoves.length) ];
}

/**
 * Юниты ударяют друг друга своими ударами 
 * @param {object} unit1 Юнит 1
 * @param {object} unit1Move Удар юнита 1
 * @param {object} unit2 Юнит 2
 * @param {object} unit2Move Удар юнита 2
 */
function makeStrike(unit1, unit1Move, unit2, unit2Move) {
  let unit1Damage = Math.ceil( unit1Move.physicalDmg * (1 - unit2Move.physicArmorPercents / 100) + unit1Move.magicDmg * (1 - unit2Move.magicArmorPercents / 100) );
  let unit2Damage = Math.ceil( unit2Move.physicalDmg * (1 - unit1Move.physicArmorPercents / 100) + unit2Move.magicDmg * (1 - unit1Move.magicArmorPercents / 100) );

  unit1.health -= unit2Damage;
  unit2.health -= unit1Damage;
}

/**
 * Юнит мертв?  
 * @param {object} unit Юнит
 * @return {boolean}
 */
function isDead(unit) {
  return unit.health <= 0;
}

/**
 * Устанавливаем cooldown юниту на удар
 * @param {object} unit Юнит
 * @param {object} unitMove Удар
 */
function setCooldown(unit, unitMove) {
  let val = unit.moves.find(item => item.name == unitMove.name);
  val.turnsOnCooldown = val.cooldown;
}

/**
 * Обновляем cooldown'ы у юнитов
 * @param {array[object]} units Массив с юнитами
 */
function refreshCooldowns(...units) {
  units.forEach(unit => {
    unit.moves.forEach(move => {
      if (move.turnsOnCooldown > 0) {
        move.turnsOnCooldown--;
      }
    })
  })
}