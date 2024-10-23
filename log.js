import logs from './logsData.js';

export const generateLog = (character, enemy) => {
    const randomIndex = Math.floor(Math.random() * logs.length);
    let logMessage = logs[randomIndex]
        .replace('[ПЕРСОНАЖ №1]', enemy.name)
        .replace('[ПЕРСОНАЖ №2]', character.name);
    return logMessage;
};

export const logFight = (character, enemy, damageCharacter, damageEnemy, isGameOver = false) => {
    const log = document.getElementById('logs');

    if (isGameOver) {
        const winner = character.damageHP > 0 ? character.name : enemy.name;
        const loser = character.damageHP > 0 ? enemy.name : character.name;
        const gameOverMessage = `<span style="color: red;">Игра окончена! ${winner} победил, а ${loser} проиграл!</span><br><br><br>`;
        log.innerHTML = gameOverMessage + log.innerHTML;
    } else {
        const logMessage = generateLog(character, enemy);
        const fightInfo = `
            ${logMessage}<br>
            ${character.name} нанес ${damageCharacter} урона, осталось ${enemy.damageHP} HP у ${enemy.name}.<br>
            ${enemy.name} нанес ${damageEnemy} урона, осталось ${character.damageHP} HP у ${character.name}.<br><br><br>
        `;
        log.innerHTML = fightInfo + log.innerHTML;
    }
};

export const logFinish = (character,enemy)=>{
    const log = document.getElementById('logs');
    console.log("p",character.damageHP);
    console.log("e",enemy.damageHP);
    let gameOverMessage;
    if(character.damageHP===0 &&enemy.damageHP===0){
        gameOverMessage = `<span style="color: red;">НІЧИЯ!</span><br><br><br>`;
        
    }
    else{
        const winner = character.damageHP > 0 ? character.name : enemy.name;
        const loser = character.damageHP > 0 ? enemy.name : character.name;
        gameOverMessage=`<span style="color: red;">Игра окончена! ${winner} победил, а ${loser} проиграл!</span><br><br><br>`;
    }   

    log.innerHTML = gameOverMessage + log.innerHTML;
};
