document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cols = document.getElementsByClassName('col');

    function randomHsl() {
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 75%)`;
    }

    function updateCounters() {
        for (const col of cols) {
            const count = col.getElementsByClassName('count')[0];
            count.textContent = col.getElementsByClassName('card').length;
        }
    }

    function save() {
        const data = {};
        for (const col of cols) {
            const status = col.getAttribute('status');
            const cards = col.getElementsByClassName('card');
            data[status] = [];
            for (const card of cards) {
                const text = card.getElementsByClassName('text')[0].innerText;
                const color = card.style.backgroundColor;
                data[status].push({ text, color });
            }
        }
        localStorage.setItem('kanban', JSON.stringify(data));
    }

    function load() {
        const saved = JSON.parse(localStorage.getItem('kanban'));
        for (const col of cols) {
            const status = col.dataset.status;
            const cards = col.getElementsByClassName('cards')[0];
            if (saved[status]) {
                for (const card of saved[status])
                    createCard(cards, card.text, card.color);
            }
        }
        updateCounters();
    }

    function createCard(
        container,
        cardText = 'Dodaj tekst',
        color = randomHsl()
    ) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.backgroundColor = color;

        const text = document.createElement('div');
        text.className = 'text';
        text.contentEditable = true;
        text.innerText = cardText;

        const del = document.createElement('button');
        del.className = 'remove';
        del.textContent = 'x';

        const controls = document.createElement('div');
        controls.className = 'controls';

        const left = document.createElement('button');
        left.className = 'left';
        left.textContent = '←';

        const right = document.createElement('button');
        right.className = 'right';
        right.textContent = '→';

        const recolor = document.createElement('button');
        recolor.className = 'recolor';
        recolor.textContent = '🎨';

        controls.appendChild(left);
        controls.appendChild(right);
        controls.appendChild(recolor);
        controls.appendChild(del);
        card.appendChild(text);
        card.appendChild(controls);
        container.appendChild(card);

        updateCounters();
        save();
    }

    board.addEventListener('click', (e) => {
        const t = e.target;

        switch (t.className) {
            case 'add': {
                const col = t.closest('.col');
                const cards = col.getElementsByClassName('cards')[0];
                createCard(cards);
                break;
            }

            case 'remove': {
                const card = t.closest('.card');
                card.remove();
                updateCounters();
                save();
                break;
            }

            case 'color': {
                const col = t.closest('.col');
                const cards = col.getElementsByClassName('card');
                for (const c of cards) {
                    c.style.backgroundColor = randomHsl();
                }
                save();
                break;
            }

            case 'sort': {
                const col = t.closest('.col');
                const cards = col.getElementsByClassName('cards')[0];
                const arr = Array.from(cards.getElementsByClassName('card'));
                arr.sort((c1, c2) =>
                    c1
                        .getElementsByClassName('text')[0]
                        .innerText.toLowerCase()
                        .localeCompare(
                            c2
                                .getElementsByClassName('text')[0]
                                .innerText.toLowerCase()
                        )
                );
                for (const card of arr) cards.appendChild(card);
                save();
                break;
            }

            case 'recolor': {
                const card = t.closest('.card');
                card.style.backgroundColor = randomHsl();
                save();
                break;
            }

            case 'left': {
                const card = t.closest('.card');
                const col = t.closest('.col');
                const prevCol = col.previousElementSibling;
                if (prevCol && prevCol.classList.contains('col')) {
                    const cardsDiv = prevCol.getElementsByClassName('cards')[0];
                    cardsDiv.appendChild(card);
                    updateCounters();
                    save();
                }
                break;
            }

            case 'right': {
                const card = t.closest('.card');
                const col = t.closest('.col');
                const nextCol = col.nextElementSibling;
                if (nextCol && nextCol.classList.contains('col')) {
                    const cardsDiv = nextCol.getElementsByClassName('cards')[0];
                    cardsDiv.appendChild(card);
                    updateCounters();
                    save();
                }
                break;
            }
        }
    });

    board.addEventListener('input', (e) => {
        if (e.target.className === 'text') save();
    });

    load();
});
