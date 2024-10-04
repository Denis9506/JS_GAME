const $btnKick = document.getElementById('btn-kick');
const $btnSlam = document.getElementById('btn-slam');

const character = createPokemon('Pikachu', 100, 'health-character', 'progressbar-character');
const enemy = createPokemon('Charmander', 120, 'health-enemy', 'progressbar-enemy');

function createPokemon(name, hp, elHPId, elProgressbarId) {
    return {
        name,
        defaultHP: hp,
        damageHP: hp,
        elHP: document.getElementById(elHPId),
        elProgressbar: document.getElementById(elProgressbarId),

        renderHP() {
            this.renderHPLife();
            this.renderProgressbarHP();
        },
        
        renderHPLife() {
            this.elHP.innerText = `${this.damageHP} / ${this.defaultHP}`;
        },
        
        renderProgressbarHP() {
            const healthPercentage = (this.damageHP / this.defaultHP) * 100;
            this.elProgressbar.style.width = `${healthPercentage}%`;
            this.elProgressbar.style.background = this.getProgressColor();
        },

        changeHP(damage) {
            this.damageHP = Math.max(0, this.damageHP - damage);
            this.renderHP();
            return this.damageHP === 0;
        },
        
        getProgressColor() {
            const percentHP = (this.damageHP / this.defaultHP) * 100;
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

            if (this.changeHP(enemyDamage)) {
                alert(`Бедный ${this.name} проиграл бой!`);
            } else if (enemy.changeHP(characterDamage)) {
                alert(`Бедный ${enemy.name} проиграл бой!`);
            }

            this.checkEndGame(enemy);
        },

        checkEndGame(enemy) {
            if (this.damageHP === 0 || enemy.damageHP === 0) {
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

$btnKick.addEventListener('click', function () {
    handleAttack(20);
});

$btnSlam.addEventListener('click', function () {
    handleAttack(30);
});

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
