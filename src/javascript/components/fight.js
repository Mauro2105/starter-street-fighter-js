import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        firstFighter.criticalHitCombination = controls.PlayerOneCriticalHitCombination;
        secondFighter.criticalHitCombination = controls.PlayerTwoCriticalHitCombination;

        let firstFighterHealth = firstFighter.health;
        let secondFighterHealth = secondFighter.health;

        const pressedKeys = new Set();

        const lastCriticalHitTime = {
            [controls.PlayerOneCriticalHitCombination.join('')]: 0,
            [controls.PlayerTwoCriticalHitCombination.join('')]: 0
        };

        function onKeyDown(event) {
            const key = event.code;
            pressedKeys.add(key);

            if (key === controls.PlayerOneBlock) {
                firstFighter.isBlocking = true;
            }

            if (key === controls.PlayerTwoBlock) {
                secondFighter.isBlocking = true;
            }

            if (key === controls.PlayerOneAttack) {
                if (!secondFighter.isBlocking) {
                    const damage = getDamage(firstFighter, secondFighter);
                    secondFighterHealth -= damage;
                }
            }

            if (key === controls.PlayerTwoAttack) {
                if (!firstFighter.isBlocking) {
                    // Verificar si el primer luchador está bloqueando
                    const damage = getDamage(secondFighter, firstFighter);
                    firstFighterHealth -= damage;
                }
            }

            if (isCriticalHit(controls.PlayerOneCriticalHitCombination, pressedKeys)) {
                handleCriticalHit(firstFighter, secondFighter, 'right', resolve, lastCriticalHitTime);
                secondFighterHealth -= 2 * firstFighter.attack;
            }

            if (isCriticalHit(controls.PlayerTwoCriticalHitCombination, pressedKeys)) {
                handleCriticalHit(secondFighter, firstFighter, 'left', resolve, lastCriticalHitTime);
                firstFighterHealth -= 2 * secondFighter.attack;
            }

            if (firstFighterHealth <= 0) {
                resolve(secondFighter);
                endFight(onKeyDown, onKeyUp);
            } else if (secondFighterHealth <= 0) {
                resolve(firstFighter);
                endFight(onKeyDown, onKeyUp);
            }

            updateHealthIndicators(firstFighterHealth, secondFighterHealth, firstFighter, secondFighter);
        }

        function onKeyUp(event) {
            const key = event.code;
            pressedKeys.delete(key);

            if (key === controls.PlayerOneBlock) {
                firstFighter.isBlocking = false;
            }

            if (key === controls.PlayerTwoBlock) {
                secondFighter.isBlocking = false;
            }
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    });
}

function isCriticalHit(criticalHitCombination, pressedKeys) {
    return criticalHitCombination.every(key => pressedKeys.has(key));
}

function handleCriticalHit(attacker, defender, position, resolve, lastCriticalHitTime) {
    const now = Date.now();
    const keyCombination = attacker.criticalHitCombination.join('');

    if (now - lastCriticalHitTime[keyCombination] > 10000) {
        const criticalDamage = 2 * attacker.attack;
        defender.health -= criticalDamage;
        updateHealthIndicators(defender.health, attacker.health, defender, attacker);
        lastCriticalHitTime[keyCombination] = now;
        console.log(`${attacker.name} landed a critical hit!`);

        if (defender.health <= 0) {
            resolve(attacker);
        }
    }
}

export function getDamage(attacker, defender) {
    // return damage
    const hitPower = getHitPower(attacker);
    const blockPower = defender.isBlocking ? getBlockPower(defender) : 0;
    return Math.max(0, hitPower - blockPower);
}

export function getHitPower(fighter) {
    // return hit power
    const criticalHitChance = Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    // return block power
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}

function updateHealthIndicators(firstHealth, secondHealth, firstFighter, secondFighter) {
    const leftFighterIndicator = document.getElementById('left-fighter-indicator');
    const rightFighterIndicator = document.getElementById('right-fighter-indicator');

    if (leftFighterIndicator) {
        const healthPercentage = (firstHealth / firstFighter.health) * 100;
        leftFighterIndicator.style.width = `${healthPercentage}%`;
    }

    if (rightFighterIndicator) {
        const healthPercentage = (secondHealth / secondFighter.health) * 100;
        rightFighterIndicator.style.width = `${healthPercentage}%`;
    }
}

function endFight(onKeyDown, onKeyUp) {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
}
