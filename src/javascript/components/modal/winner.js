import createElement from '../../helpers/domHelper';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const bodyElement = document.createElement('div');
    bodyElement.innerHTML = `
        <p>${fighter.name} is the winner!</p>
        <img src="${fighter.source}" alt="${fighter.name}">
    `;
    showModal({ title: 'Winner', bodyElement });
}
