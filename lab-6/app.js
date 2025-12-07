class AjaxDemo {
    constructor() {
        this.ajax = new Ajax({
            baseURL: 'https://jsonplaceholder.typicode.com',
        });

        this.elements = {
            loadButton: document.getElementById('loadButton'),
            errorButton: document.getElementById('errorButton'),
            resetButton: document.getElementById('resetButton'),
            loader: document.getElementById('loader'),
            errorHandler: document.getElementById('errorHandler'),
            postsList: document.getElementById('postsList'),
        };

        this.bindEvents();
    }

    bindEvents() {
        this.elements.loadButton.addEventListener('click', () =>
            this.loadPosts()
        );
        this.elements.errorButton.addEventListener('click', () =>
            this.callError()
        );
        this.elements.resetButton.addEventListener('click', () => this.reset());
    }

    async loadPosts() {
        this.setLoading(true);
        this.clearError();

        try {
            const posts = await this.ajax.get('/posts', { timeout: 3000 });
            this.renderPosts(posts.slice(0, 5));
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    async callError() {
        this.setLoading(true);
        this.clearError();

        try {
            await this.ajax.get('/error_endpoint');
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        this.elements.loadButton.disabled = loading;
        this.elements.errorButton.disabled = loading;
        this.elements.loader.classList.toggle('active', loading);
    }

    showError(message) {
        this.elements.errorHandler.textContent = message;
        this.elements.errorHandler.style.display = 'block';
    }

    clearError() {
        this.elements.errorHandler.style.display = 'none';
    }

    renderPosts(posts) {
        this.elements.postsList.innerHTML = posts
            .map(
                (post) => `
                        <li class="post">
                            <h3>${post.title}</h3>
                            <p>${post.body}</p>
                            <small>ID: ${post.id}</small>
                        </li>
                        `
            )
            .join('');
    }

    reset() {
        this.elements.postsList.innerHTML = '';
        this.clearError();
    }
}

new AjaxDemo();
