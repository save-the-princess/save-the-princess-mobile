let _ = require("lodash");
let frame = require("ui/frame");
let Label = require("ui/label").Label;
let Observable = require("data/observable").Observable;
let CharacterViewModel = require("../../view-models/character-view-model").CharacterViewModel;

let page;
let pageData;

class Die {
  static roll(n = 1) {
    if (n < 1) { return 0 };
    let accumulator = 0;
    for (let index = 0; index < n; index++) {
      accumulator += Math.ceil(Math.random() * 6);
    }
    return accumulator;
  }
}

let load = (args) => {
  page = args.object;
  let character = new CharacterViewModel(page.navigationContext.character);
  pageData = new Observable({
   character: character,
   monster: page.navigationContext.monster
  });
  page.bindingContext = pageData;
  startBattle();
};

let startBattle = () => {
  let battleLog = page.getViewById("battle_log");
  let turnOrder = checkInitiative(battleLog);
  let winner = combatTurns(turnOrder, battleLog);
  let label = new Label();
  label.text = `${winner.name} won the battle!`;
  console.dump(winner);
  battleLog.addChild(label);
};

let combatTurns = (turnOrder, battleLog) => {
  while (pageData.character.currentHealthPoints > 0 || pageData.monster.currentHealthPoints > 0) {
    if (turnOrder[0].currentHealthPoints > 0) {
      attack(turnOrder[0], turnOrder[1], battleLog);
    } else {
      return turnOrder[1];
    }
    if (turnOrder[1].currentHealthPoints > 0) {
      attack(turnOrder[1], turnOrder[0], battleLog);
    } else {
      return turnOrder[0];
    }
  }
}

let checkInitiative = (battleLog) => {
  let turnOrder;
  let characterSkill = Die.roll(pageData.character.skill);
  let monsterSkill = Die.roll(pageData.monster.skill);
  let label = new Label();
  if (characterSkill > monsterSkill) {
    label.text = `${pageData.character.name} got the initiative!`;
    turnOrder = [pageData.character, pageData.monster];
  } else {
    label.text = `${pageData.monster.name} got the initiative!`;
    turnOrder = [pageData.monster, pageData.character];
  }
  battleLog.addChild(label);
  return turnOrder;
};

let attack = (attacker, defender, battleLog) => {
  let power = attacker.skill + Math.max(attacker.power, attacker.firePower) + Die.roll();
  let armor = attacker.skill + defender.armor + Die.roll();
  let damage = power - armor
  let label = new Label();
  label.text = `${attacker.name} attacks!`;
  battleLog.addChild(label);
  if (damage > 0) {
    let totalDamage = Math.min(damage, defender.currentHealthPoints);
    label = new Label();
    label.text = `${defender.name} lost ${totalDamage} health points!`;
    defender.currentHealthPoints -= totalDamage;
    battleLog.addChild(label);
  } else {
    label = new Label();
    label.text = `${attacker.name} missed!`;
    battleLog.addChild(label);
  }
}

let BattleView = {
  onNavigatingTo: load
};

exports = _.extend(exports, BattleView);
