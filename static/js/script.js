document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('[data-collapse-toggle="mobile-menu"]');
    const menu = document.querySelector('#mobile-menu');

    menu.style.display = 'none';
    toggleButton.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    let selectedFunction = 'None';

    document.getElementById("ackley").addEventListener("click", () => selectedFunction = "Ackley");
    document.getElementById("booth").addEventListener("click", () => selectedFunction = "Booth");
    document.getElementById("three-hump").addEventListener("click", () => selectedFunction = "Three-Hump");

    document.getElementById('save-info').addEventListener('click', () => {
        const inertia = document.getElementById('inertia').value;
        const cognitive = document.getElementById('cognitive').value;
        const social = document.getElementById('social').value;
        const optimum = document.getElementById('optimum').value;
        const particles = document.getElementById('particles').value;
        const epochs = document.getElementById('epochs').value;
        const delay = document.getElementById('delay').value;
        const precision = document.getElementById('precision').value;

        document.getElementById('saved-info-content').textContent =
            `Selected Function: ${selectedFunction}
Inertia: ${inertia}
Cognitive Component: ${cognitive}
Social Component: ${social}
Optimum Goal: ${optimum}
Particles Amount: ${particles}
Number of Epochs: ${epochs}
Application Delay: ${delay}
Filter Precision: ${precision}`;
    });

    const functionButtons = document.querySelectorAll('.function-button');
    functionButtons.forEach(button => {
        button.addEventListener('click', () => {
            functionButtons.forEach(btn => btn.classList.remove('selected-function'));
            button.classList.add('selected-function');
        });
    });

    document.getElementById('calculate').addEventListener('click', () => {
        // TODO: Implement the calculation logic
        document.getElementById('result-content').textContent = 'Best solution (0) -> ' + '2.321312233' + '\n'});
});
