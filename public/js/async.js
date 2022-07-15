class AsyncTransfer {
    static async GetAsync(url) {
        const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-urlencoded'
                }
            }
        )

        return response;
    }

    static async PostAsync(url, content_type, data) {
        const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': content_type
                },
                body: data
            }
        )

        return response;
    }

    static async GetPageAsync(url_page) {
        const response = await AsyncTransfer.GetAsync(url_page);

        const html = await response.text();

        return html;
    }

    static async GetAPIAsync(url_page) {
        const response = await AsyncTransfer.GetAsync(url_page);

        const json = await response.json();

        return json;
    }

    static async PostAPIAsync(url_page, data) {
        const response = await AsyncTransfer.PostAsync(url_page, 'application/json', JSON.stringify(data));

        const json = await response.json();

        return json;
    }

    static async ReplacePage(id_replace, url_page) {
        let page_html = await AsyncTransfer.GetPageAsync(url_page);

        document.getElementById(id_replace).innerHTML = page_html;
    }
}

// export AsyncTransfer;
export { AsyncTransfer };

console.log('served');