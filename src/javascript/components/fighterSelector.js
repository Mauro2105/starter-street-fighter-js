import createElement from '../helpers/domHelper';
import renderArena from './arena';
import versusImg from '../../../resources/versus.png';
import { createFighterPreview } from './fighterPreview';
import fighterService from '../services/fightersService';

const fighterDetailsMap = new Map();

export async function getFighterInfo(fighterId) {
    // get fighter info from fighterDetailsMap or from service and write it to fighterDetailsMap
    if (!fighterDetailsMap.has(fighterId)) {
        try {
            const fighterInfo = await fighterService.getFighterInfo(fighterId);
            fighterDetailsMap.set(fighterId, fighterInfo);
            return fighterInfo;
        } catch (error) {
            console.error('Error fetching fighter info:', error);
            throw error;
        }
    }
    return fighterDetailsMap.get(fighterId);
}

function startFight(selectedFighters) {
    renderArena(selectedFighters);
}

function createVersusBlock(selectedFighters) {
    const canStartFight = selectedFighters.filter(Boolean).length === 2;
    const onClick = () => startFight(selectedFighters);
    const container = createElement({ tagName: 'div', className: 'preview-container___versus-block' });
    const image = createElement({
        tagName: 'img',
        className: 'preview-container___versus-img',
        attributes: { src: versusImg }
    });
    const disabledBtn = canStartFight ? '' : 'disabled';
    const fightBtn = createElement({
        tagName: 'button',
        className: `preview-container___fight-btn ${disabledBtn}`
    });

    fightBtn.addEventListener('click', onClick, false);
    fightBtn.innerText = 'Fight';
    container.append(image, fightBtn);

    return container;
}

function renderSelectedFighters(selectedFighters) {
    const fightersPreview = document.querySelector('.preview-container___root');
    const [playerOne, playerTwo] = selectedFighters;

    if (!playerOne || !playerTwo) {
        console.error('One or both fighters are undefined in renderSelectedFighters', selectedFighters);
        return;
    }

    const firstPreview = createFighterPreview(playerOne, 'left');
    const secondPreview = createFighterPreview(playerTwo, 'right');
    const versusBlock = createVersusBlock(selectedFighters);

    fightersPreview.innerHTML = '';
    fightersPreview.append(firstPreview, versusBlock, secondPreview);
}

export function createFightersSelector() {
    let selectedFighters = [];

    return async (event, fighterId) => {
        try {
            const fighter = await getFighterInfo(fighterId);
            const [playerOne, playerTwo] = selectedFighters;
            const firstFighter = playerOne ?? fighter;
            const secondFighter = playerOne ? playerTwo ?? fighter : playerTwo;
            selectedFighters = [firstFighter, secondFighter];

            console.log('Selected fighters:', selectedFighters);
            if (selectedFighters[0] && selectedFighters[1]) {
                renderSelectedFighters(selectedFighters);
            }
        } catch (error) {
            console.error('Error in createFightersSelector:', error);
        }
    };
}
