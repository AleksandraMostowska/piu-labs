class CartEl extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.items = [];
    }

    connectedCallback() {
        this.render();

        window.addEventListener('add-to-cart', (e) => {
            this.items.push(e.detail);
            this.render();
        });
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.render();
    }

    render() {
        const total = this.items.reduce((sum, p) => sum + p.price, 0);

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/main.css">

            <div class="cart-wrapper">
            <div class="cart-header">
                <span class="cart-icon">🛒</span>
                <span class="cart-title">Koszyk</span>
                <span class="cart-total">${total.toFixed(2)} zł</span>
            </div>

            <div class="cart-dropdown">
                ${
                    this.items.length === 0
                        ? `<p class="empty">Koszyk jest pusty</p>`
                        : `
                ${this.items
                    .map(
                        (item, i) => `
                    <div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.price.toFixed(2)} zł</span>
                    <button data-i="${i}">✖</button>
                    </div>
                `
                    )
                    .join('')}
                `
                }
            </div>
            </div>
        `;

        const header = this.shadowRoot.querySelector('.cart-header');
        const dropdown = this.shadowRoot.querySelector('.cart-dropdown');
        header.addEventListener('click', () => {
            dropdown.style.display =
                dropdown.style.display === 'block' ? 'none' : 'block';
        });

        this.shadowRoot
            .querySelectorAll('button')
            .forEach((btn) =>
                btn.addEventListener('click', () =>
                    this.removeItem(btn.dataset.i)
                )
            );
    }
}

customElements.define('cart-el', CartEl);
