async function GetPageAsync(url)
{
    let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-urlencoded'
            }
        }
    )

    return response.text();
}

async function ReplacePage(id_replace, url_page) {
    let page_html = await GetPageAsync(url_page);

    document.getElementById(id_replace).innerHTML = page_html;
}

console.log('served');