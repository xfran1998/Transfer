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

    static async PostFilesAsync(url_page, data) {
        const response = await fetch(url_page, {
                method: 'POST',
                body: data
            }
        )

        const json = await response.json();
        return json;
    }

    static async GetPageAsync(url_page) {
        const response = await AsyncTransfer.GetAsync(url_page);

        const html = await response.text();
        return html;
    }

    static async ReplaceTittle(html_fetched) {
        const title = html_fetched.match(/<title>(.*?)<\/title>/i)[1];
        document.title = title;
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

    static async PostTextAsync(url_page, data) {
        const response = await AsyncTransfer.PostAsync(url_page, 'application/x-www-urlencoded', data);

        const text = await response.text();
        return text;
    }

    static async ReplacePage(id_replace, url_page) {
        let page_html = await AsyncTransfer.GetPageAsync(url_page);
        AsyncTransfer.ReplaceTittle(page_html);

        document.getElementById(id_replace).innerHTML = page_html;
        AsyncTransfer.CallScripts(id_replace);
    }

    static async CallScripts(id_replace) {
        let scripts = document.querySelectorAll(`#${id_replace} script`);

        // call scripts
        scripts.forEach(script => {
            let src = script.getAttribute('src');
            // console.log('script1: ' + src);
            if (src) { // if script has src
                ( async () => {
                    const url = "http://localhost:3000" + src;
                    let script_html = await AsyncTransfer.GetPageAsync(src);
                    eval(script_html);
                })();
            }

            // if script has innerHTML
            eval(script.innerHTML);


            // let script_html = document.createElement('script');
            // script_html.innerHTML = script.innerHTML;
            // if (script_html.src) 
            //     script_html.src = script.src;
            // // make it module
            // script_html.setAttribute('type', 'module');
            // console.log('script_html: ' + script_html);
            // document.body.appendChild(script_html);
        });

    }
}

// export AsyncTransfer;
export { AsyncTransfer };