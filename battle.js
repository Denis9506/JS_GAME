export const maxClicks = 6;

export const createButtonClickCounter = (buttonName) => {
    let totalClicks = 0;
    return () => {
        totalClicks++;
        console.log(`Всего кликов для кнопки ${buttonName}: ${totalClicks}`);
    };
};

export const handleClicks = (buttonType, clickCount, damage, character, enemy) => {
    clickCount++;
    console.log(`Кнопка ${buttonType} была нажата ${clickCount} раз(а). Осталось нажатий: ${maxClicks - clickCount}`);
    return clickCount;
};
