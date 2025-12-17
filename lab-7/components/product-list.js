import productsData from '../data.json' with { type: 'json' };

class ProductList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="css/main.css">
        <div class="product-grid"></div>
    `;

    const grid = this.shadowRoot.querySelector('.product-grid');

    productsData.forEach((product) => {
      const card = document.createElement('product-card');
      card.product = product; 
      grid.appendChild(card);
    });
  }
}

customElements.define('product-list', ProductList);
