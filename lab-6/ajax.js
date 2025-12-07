class Ajax {
    constructor(options = {}) {
        this.baseURL = options.baseURL || '';
        this.headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        this.timeout = options.timeout || 5000;
    }

    async get(url, options = {}) {
        return this.#request(url, { ...options, method: 'GET' });
    }

    async post(url, data, options = {}) {
        return this.#request(url, {
            ...options,
            method: 'POST',
            body: data,
        });
    }

    async put(url, data, options = {}) {
        return this.#request(url, {
            ...options,
            method: 'PUT',
            body: data,
        });
    }

    async delete(url, options = {}) {
        return this.#request(url, { ...options, method: 'DELETE' });
    }

    async #request(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            options.timeout || this.timeout
        );

        const config = {
            ...options,
            headers: {
                ...this.headers,
                ...options.headers,
            },
            signal: controller.signal,
        };

        if (options.method !== 'GET' && options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const fullUrl = this.baseURL + url;
            const response = await fetch(fullUrl, config);

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error(`Timeout: ${options.timeout || this.timeout}`);
            }
            throw error;
        }
    }
}
