import { pokemons } from './pokemons.js';
import { Pokemon } from './pokemon.js';
import { logFinish } from './log.js';

const $startBtn = document.getElementById('start-btn');
const $playground = document.getElementById('playground');
const $characterImg = document.getElementById('character-img');
const $enemyImg = document.getElementById('enemy-img');
const $nameCharacter = document.getElementById('name-character');
const $nameEnemy = document.getElementById('name-enemy');
const $controlPanel = document.getElementById('control-panel');
let character, enemy;

let clickCounters = {};

const initGame = () => {
    $startBtn.style.display = 'block';
    $playground.style.display = 'none';
};
let defeatedEnemiesCount = 0; 
const $score = document.getElementById('score'); 
const updateScore = () => {
    defeatedEnemiesCount++;
    $score.textContent = `Enemies defeated: ${defeatedEnemiesCount}`;
};

const startGame = () => {
    const log = document.getElementById('logs');
    const randomPokemons = getRandomPokemons();
    character = new Pokemon(
        randomPokemons[0].name, 
        randomPokemons[0].hp, 
        'health-character', 
        'progressbar-character', 
        randomPokemons[0].attacks 
    );
    enemy = new Pokemon(
        randomPokemons[1].name, 
        randomPokemons[1].hp, 
        'health-enemy', 
        'progressbar-enemy', 
        randomPokemons[1].attacks 
    );

    $characterImg.src = randomPokemons[0].img;
    $enemyImg.src = randomPokemons[1].img;
    $nameCharacter.textContent = randomPokemons[0].name;
    $nameEnemy.textContent = randomPokemons[1].name;
    defeatedEnemiesCount=0;
    $score.textContent = `Enemies defeated: ${defeatedEnemiesCount}`;

    setupAttackButtons(randomPokemons[0]);

    character.renderHP();
    enemy.renderHP();

    $startBtn.style.display = 'none';
    $playground.style.display = 'flex';
    log.innerHTML = "";

};


const getRandomPokemons = () => {
    const shuffledPokemons = pokemons.sort(() => 0.5 - Math.random());
    return [shuffledPokemons[0], shuffledPokemons[1]];
};

const setupAttackButtons = (pokemon) => {
    $controlPanel.innerHTML = ''; 
    clickCounters = {};

    pokemon.attacks.forEach(attack => {
        const $button = document.createElement('button');
        $button.classList.add('button');
        $button.textContent = attack.name;
        $button.addEventListener('click', () => handleAttack(attack, $button));
        clickCounters[attack.name] = 0;
        $controlPanel.appendChild($button);
    });
};
const handleAttack = (attack, button) => {
    disableAttackButtons();

    clickCounters[attack.name]++;
    if (clickCounters[attack.name] >= attack.maxCount) {
        button.disabled = true;
    }

    const isEnemyDefeated = character.attack(enemy, attack.minDamage, attack.maxDamage);

    if (isEnemyDefeated) {
        alert(`${enemy.name} повержен! Загружается новый противник...`);
        logFinish(character, enemy);

        const restoredHP = Math.min(character.defaultHP, character.damageHP + character.defaultHP * 0.5);
        character.damageHP = restoredHP;
        character.renderHP();

        updateScore();

        const newEnemy = getRandomPokemons()[1];

        enemy = new Pokemon(
            newEnemy.name,
            newEnemy.hp,
            'health-enemy',
            'progressbar-enemy',
            newEnemy.attacks
        );

        $enemyImg.src = newEnemy.img;
        $nameEnemy.textContent = newEnemy.name;
        enemy.renderHP();
    } else {
        setTimeout(() => enemyAttack(), 200); 
    }


    setTimeout(() => {
        enableAttackButtons();
    }, 550);
};


const disableAttackButtons = () => {
    const buttons = $controlPanel.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
};

const enableAttackButtons = () => {
    const buttons = $controlPanel.querySelectorAll('button');
    buttons.forEach(button => {
        const attackName = button.textContent;
        if (clickCounters[attackName] < getAttackMaxCount(attackName)) {
            button.disabled = false;
        }
    });
};

const getAttackMaxCount = (attackName) => {
    const attack = character.attacks.find(att => att.name === attackName);
    return attack ? attack.maxCount : 0;
};

const enemyAttack = () => {
    const randomAttack = enemy.getRandomAttack();
    const isCharacterDefeated = enemy.attack(character, randomAttack.minDamage, randomAttack.maxDamage);

    if (isCharacterDefeated) {
        logFinish(character,enemy);
        alert(`${character.name} проиграл! Игра закончена.`);
        $startBtn.style.display = 'block';
        $playground.style.display = 'none';
    }
};





$startBtn.addEventListener('click', startGame);

initGame();
