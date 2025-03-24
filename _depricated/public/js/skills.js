//Opens the skill boxees with onclick event
function initializeSkillBoxes() {
    const skillBoxes = document.querySelectorAll('.skills-box');

    skillBoxes.forEach(box => {
        box.addEventListener('click', () => {
            skillBoxes.forEach(b => b.classList.remove('active'));
            box.classList.add('active');
        });
    });
}