const $btnKick = document.getElementById('btn-kick');
const $btnSlam = document.getElementById('btn-slam');

const character = createPokemon('Pikachu', 100, 'health-character', 'progressbar-character');
const enemy = createPokemon('Charmander', 100, 'health-enemy', 'progressbar-enemy');

let isButtonDisabled = false;

function createPokemon(name, hp, elHPId, elProgressbarId) {
    return {
        name,
        defaultHP: hp,
        damageHP: hp,
        elHP: document.getElementById(elHPId),
        elProgressbar: document.getElementById(elProgressbarId),
    };
}

$btnKick.addEventListener('click', function () {
    if (!isButtonDisabled) {
        handleAttack(20);
        disableButtonsTemporarily();
    }
});

$btnSlam.addEventListener('click', function () {
    if (!isButtonDisabled) {
        handleAttack(30);
        disableButtonsTemporarily();
    }
});

function disableButtonsTemporarily() {
    isButtonDisabled = true;
    $btnKick.disabled = true;
    $btnSlam.disabled = true;

    setTimeout(function () {
        isButtonDisabled = false;
        $btnKick.disabled = false;
        $btnSlam.disabled = false;
    }, 500);
}

function handleAttack(damage) {
    const characterDamage = random(damage);
    const enemyDamage = random(damage);
    console.log(`${characterDamage}`)
    console.log(`${enemyDamage}`)
    
    if(changeHP(characterDamage, character) || changeHP(enemyDamage, enemy))
        resetGame();
}

function init() {
    console.log('Start game');
    renderHP(character);
    renderHP(enemy);
}

function renderHP(person) {
    renderHPLife(person);
    renderProgressbarHP(person);
}

function renderHPLife(person) {
    person.elHP.innerText = person.damageHP + ' / ' + person.defaultHP;
}

function renderProgressbarHP(person) {
    const healthPercentage = (person.damageHP / person.defaultHP) * 100;
    person.elProgressbar.style.width = healthPercentage + '%';
    person.elProgressbar.style.background = getProgressColor(person.damageHP, person.defaultHP);
}

function changeHP(count, person) {
    if (person.damageHP <= count) {
        person.damageHP = 0;
        renderHP(person); 
        alert('Бедный ' + person.name + ' проиграл бой!!!');
        $btnKick.disabled = true;
        $btnSlam.disabled = true;
        return true;  
    } else {
        person.damageHP -= count;
    }
    renderHP(person);
    return false;
}

function resetGame() {
    character.damageHP = character.defaultHP;
    enemy.damageHP = enemy.defaultHP;
    renderHP(character);
    renderHP(enemy);
    $btnKick.disabled = false;
    $btnSlam.disabled = false;
}

function random(num) {
    return Math.ceil(Math.random() * num);
}

function getProgressColor(currentHP, maxHP) {
    const percentHP = (currentHP / maxHP) * 100;
    if (percentHP > 50) {
        return 'linear-gradient(to right, lime, #8bf500)';
    } else if (percentHP > 20) {
        return 'linear-gradient(to right, orange, #ffcc00)'; 
    } else {
        return 'linear-gradient(to right, red, darkred)'; 
    }
}

init();
