const $btnKick = document.getElementById('btn-kick');
const $btnSlam = document.getElementById('btn-slam');

const character = createPokemon('Pikachu', 20, 'health-character', 'progressbar-character');
const enemy = createPokemon('Charmander', 20, 'health-enemy', 'progressbar-enemy');

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
            enableButtons();
        },

        randomDamage(maxDamage) {
            return Math.ceil(Math.random() * maxDamage);
        }
    };
}

$btnKick.addEventListener('click', () => handleAttack(20));
$btnSlam.addEventListener('click', () => handleAttack(30));

function handleAttack(damage) {
    character.attack(enemy, damage);
    disableButtonsTemporarily();
}

function disableButtonsTemporarily() {
    $btnKick.disabled = true;
    $btnSlam.disabled = true;
    setTimeout(enableButtons, 500);
}

function enableButtons() {
    $btnKick.disabled = false;
    $btnSlam.disabled = false;
}

init();

function init() {
    console.log('Start game');
    character.renderHP();
    enemy.renderHP();
}



const logs = [
    '[ПЕРСОНАЖ №1] вспомнил что-то важное, но неожиданно [ПЕРСОНАЖ №2], не помня себя от испуга, ударил в предплечье врага.',
    '[ПЕРСОНАЖ №1] поперхнулся, и за это [ПЕРСОНАЖ №2] с испугу приложил прямой удар коленом в лоб врага.',
    '[ПЕРСОНАЖ №1] забылся, но в это время наглый [ПЕРСОНАЖ №2], приняв волевое решение, неслышно подойдя сзади, ударил.',
    '[ПЕРСОНАЖ №1] пришел в себя, но неожиданно [ПЕРСОНАЖ №2] случайно нанес мощнейший удар.',
    '[ПЕРСОНАЖ №1] поперхнулся, но в это время [ПЕРСОНАЖ №2] нехотя раздробил кулаком <вырезанно цензурой> противника.',
    '[ПЕРСОНАЖ №1] удивился, а [ПЕРСОНАЖ №2] пошатнувшись влепил подлый удар.',
    '[ПЕРСОНАЖ №1] высморкался, но неожиданно [ПЕРСОНАЖ №2] провел дробящий удар.',
    '[ПЕРСОНАЖ №1] пошатнулся, и внезапно наглый [ПЕРСОНАЖ №2] беспричинно ударил в ногу противника.',
    '[ПЕРСОНАЖ №1] расстроился, как вдруг, неожиданно [ПЕРСОНАЖ №2] случайно влепил стопой в живот соперника.',
    '[ПЕРСОНАЖ №1] пытался что-то сказать, но вдруг, неожиданно [ПЕРСОНАЖ №2] со скуки, разбил бровь сопернику.'
];
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
            const drawMessage = `Игра окончена! Ничья, оба персонажа (${character.name} и ${enemy.name}) упали без сил!<br><br><br>`;
            log.innerHTML = drawMessage + log.innerHTML;
        } else {
            const winner = character.damageHP > 0 ? character.name : enemy.name;
            const loser = character.damageHP > 0 ? enemy.name : character.name;
            const gameOverMessage = `Игра окончена! ${winner} победил, а ${loser} проиграл!<br><br><br>`;
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
