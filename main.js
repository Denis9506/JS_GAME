import { Pokemon } from './pokemon.js';
import { createButtonClickCounter,handleClicks } from './battle.js';

const $btnKick = document.getElementById('btn-kick');
const $btnSlam = document.getElementById('btn-slam');

let clickCountKick = 0;
let clickCountSlam = 0;

const maxClicks = 6;

const kickClickCounter = createButtonClickCounter('Kick');
const slamClickCounter = createButtonClickCounter('Slam');

const character = new Pokemon('Pikachu', 100, 'health-character', 'progressbar-character');
const enemy = new Pokemon('Charmander', 100, 'health-enemy', 'progressbar-enemy');

function resetGame() {
    character.resetHP();
    enemy.resetHP();
    resetClickCounts();
    enableButtons();
    console.log('Игра была сброшена');
}

function resetClickCounts() {
    clickCountKick = 0;
    clickCountSlam = 0;
}

function enableButtons() {
    $btnKick.disabled = false;
    $btnSlam.disabled = false;
}

function checkIfGameShouldReset(isCharacterDefeated, isEnemyDefeated) {
    if (isCharacterDefeated || isEnemyDefeated) {
        resetGame();
        return true;
    }
    return false;
}

$btnKick.addEventListener('click', () => {
    kickClickCounter();
    clickCountKick = handleClicks('Kick', clickCountKick, 20, character, enemy);
    if (clickCountKick >= maxClicks) $btnKick.disabled = true;

    const { isCharacterDefeated, isEnemyDefeated } = character.attack(enemy, 20);
    
    if (checkIfGameShouldReset(isCharacterDefeated, isEnemyDefeated)) return;
    
    if (clickCountKick >= maxClicks) $btnKick.disabled = true;
});

$btnSlam.addEventListener('click', () => {
    slamClickCounter();
    clickCountSlam = handleClicks('Slam', clickCountSlam, 30, character, enemy);
    if (clickCountSlam >= maxClicks) $btnSlam.disabled = true;

    const { isCharacterDefeated, isEnemyDefeated } = character.attack(enemy, 30);
    
    if (checkIfGameShouldReset(isCharacterDefeated, isEnemyDefeated)) return;

    if (clickCountSlam >= maxClicks) $btnSlam.disabled = true;
});

const init = () => {
    console.log('Start game');
    character.renderHP();
    enemy.renderHP();
};

init();

