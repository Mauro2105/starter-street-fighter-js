import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    if (!fighter) {
        console.error('Fighter data is undefined in createFighterPreview');
        return createElement({ tagName: 'div' });
    }

    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // show fighter info (image, name, health, etc.)
    const fighterImage = createFighterImage(fighter);
    const fighterName = createElement({
        tagName: 'span',
        className: 'fighter-preview___name'
    });
    fighterName.innerText = fighter.name;

    const fighterHealth = createElement({
        tagName: 'span',
        className: 'fighter-preview___health'
    });
    fighterHealth.innerText = `Health: ${fighter.health}`;

    fighterElement.append(fighterImage, fighterName, fighterHealth);

    return fighterElement;
}

export function createFighterImage(fighter) {
    if (!fighter) {
        console.error('Fighter data is undefined in createFighterImage');
        return createElement({ tagName: 'div' });
    }

    /* const { source, name } = fighter;
    if (!source || !name) {
        console.error('Fighter source or name is missing in createFighterImage', fighter);
        return createElement({ tagName: 'div' });
    } */

    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
