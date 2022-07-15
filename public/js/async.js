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
        console.log('replace page');
        let page_html = await AsyncTransfer.GetPageAsync(url_page);

        document.getElementById(id_replace).innerHTML = page_html;
        AsyncTransfer.CallScripts();
    }

    static async CallScripts() {
        let scripts = document.querySelectorAll('script');
        console.log('call scripts');

        // call scripts
        scripts.forEach(script => {
            // let src = script.getAttribute('src');
            // if (src) { // if script has src
            //     let script_html = AsyncTransfer.GetPageAsync(src);
            //     eval(script_html);
            // }

            // if script has innerHTML
            // eval(script.innerHTML);


            let script_html = document.createElement('script');
            script_html.innerHTML = script.innerHTML;
            if (script_html.src) 
                script_html.src = script.src;
            // make it module
            script_html.setAttribute('type', 'module');
            document.body.appendChild(script_html);
        });

    }
}

// export AsyncTransfer;
export { AsyncTransfer };

console.log('served');