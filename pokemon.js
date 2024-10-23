import { logFight } from './log.js';

export class Pokemon {
    constructor(name, hp, elHPId, elProgressbarId) {
        this.name = name;
        this.defaultHP = hp;
        this.damageHP = hp;
        this.elHP = document.getElementById(elHPId);
        this.elProgressbar = document.getElementById(elProgressbarId);
    }

    renderHP() {
        this.elHP.innerText = `${this.damageHP} / ${this.defaultHP}`;
        this.elProgressbar.style.width = `${(this.damageHP / this.defaultHP) * 100}%`;
        this.elProgressbar.style.background = this.getProgressColor();
    }

    getProgressColor() {
        const percentHP = (this.damageHP / this.defaultHP) * 100;
        if (percentHP > 50) {
            return 'linear-gradient(to right, lime, #8bf500)';
        } else if (percentHP > 20) {
            return 'linear-gradient(to right, orange, #ffcc00)';
        } else {
            return 'linear-gradient(to right, red, darkred)';
        }
    }

    changeHP(damage) {
        this.damageHP = Math.max(0, this.damageHP - damage);
        this.renderHP();
        return this.damageHP === 0;
    }

    attack(enemy, maxDamage) {
        const characterDamage = this.randomDamage(maxDamage);
        const enemyDamage = enemy.randomDamage(maxDamage);

        const isCharacterDefeated = this.changeHP(enemyDamage);
        const isEnemyDefeated = enemy.changeHP(characterDamage);

        logFight(this, enemy, characterDamage, enemyDamage);

        if (isCharacterDefeated && isEnemyDefeated) {
            alert("Ничья");
        } else if (isCharacterDefeated) {
            alert(`Бедный ${this.name} проиграл бой!`);
        } else if (isEnemyDefeated) {
            alert(`Бедный ${enemy.name} проиграл бой!`);
        }

        return { isCharacterDefeated, isEnemyDefeated };
    }

    randomDamage(maxDamage) {
        return Math.ceil(Math.random() * maxDamage);
    }

    resetHP() {
        this.damageHP = this.defaultHP;
        this.renderHP();
    }

    isDefeated() {
        return this.damageHP === 0;
    }
}
