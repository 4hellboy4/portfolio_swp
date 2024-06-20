
document.addEventListener('DOMContentLoaded', async function () {
    const xkcdFetchButton = document.getElementById('XKCD-id-fetch-btn');
    const emailInput = document.querySelector('input[name="email-form"]');
    const xkcd_p = document.getElementById('xkcd-token');
    let xkcd_token = '';
    const api_info_field = document.getElementById('API-info');
    const publication_date = document.getElementById('publication-date');
    const comic_img = document.getElementById('comic-img');

    async function xkcdFetch() {
        const params = new URLSearchParams();
        if (emailInput.value) {
            params.append('email', emailInput.value);
        }
        return fetch('https://fwd.innopolis.university/api/hw2?' + params.toString()).then(r => r.json());
    }

    async function apiInfoFetch() {
        const params = new URLSearchParams();
        if (xkcd_token) {
            params.append('id', xkcd_token);
        }
        return fetch('https://fwd.innopolis.university/api/comic?' + params.toString()).then(r => r.json());
    }

    xkcdFetchButton.addEventListener('click', async function() {
        xkcd_p.textContent = 'Loading';
        const xkcdToken = await xkcdFetch();
        xkcd_token = xkcdToken;
        xkcd_p.textContent = xkcd_token;
        API_fetch = await apiInfoFetch();
        const { month,day,year,alt,img,safe_title } = API_fetch;
        const date = new Date(year, month - 1, day);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        api_info_field.textContent = safe_title;
        publication_date.textContent = formattedDate;
        comic_img.src = img;
        comic_img.alt = alt;
    });


});

