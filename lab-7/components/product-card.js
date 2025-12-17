class ProductCard extends HTMLElement {
    #product = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set product(value) {
        this.#product = value;
        this.render();
    }

    get product() {
        return this.#product;
    }

    #emitAddToCart(name, price) {
        this.dispatchEvent(
            new CustomEvent('add-to-cart', {
                detail: { name, price },
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        if (!this.#product) return;

        const { name, price, colors, sizes, img, promo } = this.#product;

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/main.css">
            <div class="product-card">
                <img src="${img}" alt="${name}">
                ${promo ? `<div class="promo">${promo}</div>` : ''}
                <h3>${name}</h3>
                <p class="price">${price} zł</p>
                ${colors ? `<p>Kolory: ${colors.join(', ')}</p>` : ''}
                <button class="add-btn">Do koszyka</button>
            </div>
        `;

        this.shadowRoot
            .querySelector('.add-btn')
            .addEventListener('click', () => {
                this.#emitAddToCart(name, price);
            });
    }
}

customElements.define('product-card', ProductCard);
