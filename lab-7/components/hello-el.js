class HelloEl extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const name = this.getAttribute('name');
        const price = this.getAttribute('price');
        const colors = this.getAttribute('colors');
        const sizes = this.getAttribute('sizes');
        const img = this.getAttribute('img');
        const promo = this.getAttribute('promo');

        let sizesBtns = '';
        if (sizes) {
            sizesBtns = `
                <div class="sizes">
                <span>Rozmiary:</span>
                <div class="size-buttons">
                    ${sizes
                        .split(',')
                        .map((size) => {
                            if (size.startsWith('!')) {
                                return `<button class="size-btn disabled" disabled>${size.slice(
                                    1
                                )}</button>`;
                            }
                            return `<button class="size-btn">${size}</button>`;
                        })
                        .join('')}
                </div>
                </div>
            `;
        }

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/main.css">
            <div class="product-card">

                <img src="${img}" alt="${name}">

                ${promo ? `<div class="promo">${promo}</div>` : ''}

                <h3>${name}</h3>
                <p class="price">${price} zł</p>

                ${colors ? `<p class="colors">Kolory: ${colors}</p>` : ''}

                ${sizesBtns}

                <button class="add-btn">Do koszyka</button>
                <p class="cart-message">Produkt dodany do koszyka ✔</p>

            </div>
        `;

        const button = this.shadowRoot.querySelector('.add-btn');
        const message = this.shadowRoot.querySelector('.cart-message');

        message.style.display = 'none';

        button.addEventListener('click', () => {
            message.style.display = 'block';

            setTimeout(() => {
                message.style.display = 'none';
            }, 2000);
        });

        const sizeButtons = this.shadowRoot.querySelectorAll(
            '.size-btn:not(.disabled)'
        );
        sizeButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                sizeButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
}

customElements.define('hello-el', HelloEl);
