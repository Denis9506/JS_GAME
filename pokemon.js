import { logFight } from './log.js';

export class Pokemon {
    constructor(name, hp, elHPId, elProgressbarId, attacks) {
        this.name = name;
        this.defaultHP = hp;
        this.damageHP = hp;
        this.elHP = document.getElementById(elHPId);
        this.elProgressbar = document.getElementById(elProgressbarId);
        this.attacks = attacks;
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

    attack(target, minDamage, maxDamage) {
        const damage = this.randomDamage(minDamage, maxDamage);
        const isTargetDefeated = target.changeHP(damage);
        logFight(this, target, damage, 0);
        return isTargetDefeated;
    }

    randomDamage(minDamage, maxDamage) {
        return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
    }

    getRandomAttack() {
        return this.attacks[Math.floor(Math.random() * this.attacks.length)];
    }

    isDefeated() {
        return this.damageHP === 0;
    }
}
