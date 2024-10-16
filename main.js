import logs from './logs.js';

const $btnKick = document.getElementById('btn-kick');
const $btnSlam = document.getElementById('btn-slam');

const character = createPokemon('Pikachu', 100, 'health-character', 'progressbar-character');
const enemy = createPokemon('Charmander', 100, 'health-enemy', 'progressbar-enemy');

function createPokemon(name, hp, elHPId, elProgressbarId) {
    const elHP = document.getElementById(elHPId);
    const elProgressbar = document.getElementById(elProgressbarId);

    return {
        name,
        defaultHP: hp,
        damageHP: hp,
        elHP,
        elProgressbar,

        renderHP() {
            this.renderHPLife();
            this.renderProgressbarHP();
        },

        renderHPLife() {
            const { damageHP, defaultHP, elHP } = this;
            elHP.innerText = `${damageHP} / ${defaultHP}`;
        },

        renderProgressbarHP() {
            const { damageHP, defaultHP, elProgressbar } = this;
            const healthPercentage = (damageHP / defaultHP) * 100;
            elProgressbar.style.width = `${healthPercentage}%`;
            elProgressbar.style.background = this.getProgressColor();
        },

        changeHP(damage) {
            const { damageHP } = this;
            this.damageHP = Math.max(0, damageHP - damage);
            this.renderHP();
            return this.damageHP === 0;
        },

        getProgressColor() {
            const { damageHP, defaultHP } = this;
            const percentHP = (damageHP / defaultHP) * 100;
            if (percentHP > 50) {
                return 'linear-gradient(to right, lime, #8bf500)';
            } else if (percentHP > 20) {
                return 'linear-gradient(to right, orange, #ffcc00)';
            } else {
                return 'linear-gradient(to right, red, darkred)';
            }
        },

        attack(enemy, damage) {
            const characterDamage = this.randomDamage(damage);
            const enemyDamage = enemy.randomDamage(damage);
        
            const isCharacterDefeated = this.changeHP(enemyDamage);
            const isEnemyDefeated = enemy.changeHP(characterDamage);
        
            logFight(character, enemy, characterDamage, enemyDamage);
        
            if (isCharacterDefeated && isEnemyDefeated){
                alert("Нічья");
            }
            else if (isCharacterDefeated) {
                alert(`Бедный ${this.name} проиграл бой!`);
            } else if (isEnemyDefeated) {
                alert(`Бедный ${enemy.name} проиграл бой!`);
            }
           
            this.checkEndGame(enemy);
        },
        
        checkEndGame(enemy) {
            if (this.damageHP === 0 || enemy.damageHP === 0) {
                logFight(this, enemy, 0, 0, true); 
                this.resetGame(enemy);
            }
        },

        resetGame(enemy) {
            this.damageHP = this.defaultHP;
            enemy.damageHP = enemy.defaultHP;
            this.renderHP();
            enemy.renderHP();
            resetClickCounts();
            enableButtons();
        },

        randomDamage(maxDamage) {
            return Math.ceil(Math.random() * maxDamage);
        }
    };
}

const maxClicks = 6;
let clickCountKick = 0;
let clickCountSlam = 0;

const createButtonClickCounter = function(buttonName) {
    let totalClicks = 0;
    return function() {
        totalClicks++;
        console.log(`Всего кликов для кнопки ${buttonName}: ${totalClicks}`);
    };
};

const kickClickCounter = createButtonClickCounter('Kick');
const slamClickCounter = createButtonClickCounter('Slam');

$btnKick.addEventListener('click', () => {
    kickClickCounter(); 
    handleAttack(20, 'Kick');
});

$btnSlam.addEventListener('click', () => {
    slamClickCounter(); 
    handleAttack(30, 'Slam');
});

function handleAttack(damage, buttonType) {
    if (buttonType === 'Kick' && clickCountKick < maxClicks) {
        clickCountKick++;
        console.log(`Кнопка Kick была нажата ${clickCountKick} раз(а). Осталось нажатий: ${maxClicks - clickCountKick}`);
        character.attack(enemy, damage);
    } else if (buttonType === 'Slam' && clickCountSlam < maxClicks) {
        clickCountSlam++;
        console.log(`Кнопка Slam была нажата ${clickCountSlam} раз(а). Осталось нажатий: ${maxClicks - clickCountSlam}`);
        character.attack(enemy, damage);
    }

    if (clickCountKick >= maxClicks) {
        $btnKick.disabled = true;
    }

    if (clickCountSlam >= maxClicks) {
        $btnSlam.disabled = true;
    }

    disableButtonsTemporarily();
}

function disableButtonsTemporarily() {
    $btnKick.disabled = true;
    $btnSlam.disabled = true;
    setTimeout(enableButtons, 500);
}

function enableButtons() {
    if (clickCountKick < maxClicks) $btnKick.disabled = false;
    if (clickCountSlam < maxClicks) $btnSlam.disabled = false;
}

function resetClickCounts() {
    clickCountKick = 0;
    clickCountSlam = 0;
    console.log('Счетчики кликов сброшены');
}

function generateLog(character, enemy) {
    const randomIndex = Math.floor(Math.random() * logs.length);
    let logMessage = logs[randomIndex]
        .replace('[ПЕРСОНАЖ №1]', enemy.name )
        .replace('[ПЕРСОНАЖ №2]', character.name);
    return logMessage;
}

function logFight(character, enemy, damageCharacter, damageEnemy, isGameOver = false) {
    const log = document.getElementById('logs');

    if (isGameOver) {
        if (character.damageHP === 0 && enemy.damageHP === 0) {
            const drawMessage = `<span style="color: red;">Игра окончена! Ничья, оба персонажа (${character.name} и ${enemy.name}) упали без сил!</span><br><br><br>`;
            log.innerHTML = drawMessage + log.innerHTML;
        } else {
            const winner = character.damageHP > 0 ? character.name : enemy.name;
            const loser = character.damageHP > 0 ? enemy.name : character.name;
            const gameOverMessage = `<span style="color: red;">Игра окончена! ${winner} победил, а ${loser} проиграл!</span><br><br><br>`;
            log.innerHTML = gameOverMessage + log.innerHTML;
        }
    } else {
        const logMessage = generateLog(character, enemy);
        const fightInfo = `
            ${logMessage}<br>
            ${character.name} нанес ${damageCharacter} урона, осталось ${enemy.damageHP} HP у ${enemy.name}.<br>
            ${enemy.name} нанес ${damageEnemy} урона, осталось ${character.damageHP} HP у ${character.name}.<br><br><br>
        `;

        log.innerHTML = fightInfo + log.innerHTML;
    }
}

init();

function init() {
    console.log('Start game');
    character.renderHP();
    enemy.renderHP();
}
