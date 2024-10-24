import logs from './logsData.js';

export const generateLog = (character, enemy) => {
    const randomIndex = Math.floor(Math.random() * logs.length);
    let logMessage = logs[randomIndex]
        .replace('[ПЕРСОНАЖ №1]', enemy.name)
        .replace('[ПЕРСОНАЖ №2]', character.name);
    return logMessage;
};

export const logFight = (attacker, target, damageAttacker, damageTarget) => {
    const log = document.getElementById('logs');
    const logMessage = generateLog(attacker, target);
    const fightInfo = `
        ${logMessage}<br>
        ${attacker.name} нанес ${damageAttacker} урона, осталось ${target.damageHP} HP у ${target.name}.<br><br><br>
    `;
    log.innerHTML = fightInfo + log.innerHTML;
};

export const logFinish = (character,enemy)=>{
    const log = document.getElementById('logs');
    let gameOverMessage;
    // if(character.damageHP===0 &&enemy.damageHP===0){
    //     gameOverMessage = `<span style="color: red;">НІЧИЯ!</span><br><br><br>`;
        
    // }
        const winner = character.damageHP > 0 ? character.name : enemy.name;
        const loser = character.damageHP > 0 ? enemy.name : character.name;
        gameOverMessage=`<span style="color: red;">Игра окончена! ${winner} победил, а ${loser} проиграл!</span><br><br><br>`;

    log.innerHTML = gameOverMessage + log.innerHTML;
};
