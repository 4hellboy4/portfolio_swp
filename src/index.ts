import { XKCDComic } from './types';
import { formatDistanceToNow } from 'date-fns';

document.addEventListener('DOMContentLoaded', () => {
    const xkcdFetchButton = document.getElementById('XKCD-id-fetch-btn') as HTMLButtonElement | null;
    const emailInput = document.querySelector('input[name="email-form"]') as HTMLInputElement | null;
    const xkcd_p = document.getElementById('xkcd-token') as HTMLParagraphElement | null;
    const api_info_field = document.getElementById('API-info') as HTMLDivElement | null;
    const publication_date = document.getElementById('publication-date') as HTMLDivElement | null;
    const comic_img = document.getElementById('comic-img') as HTMLImageElement | null;

    if (!xkcdFetchButton || !emailInput || !xkcd_p || !api_info_field || !publication_date || !comic_img) {
        console.error('Required DOM elements are not found');
        return;
    }

    let xkcd_token = '';

    async function xkcdFetch(): Promise<string> {
        const params = new URLSearchParams();
        if (emailInput!.value) {
            params.append('email', emailInput!.value);
        }
        const response = await fetch(`https://fwd.innopolis.university/api/hw2?${params.toString()}`);
        return response.text();
    }

    async function apiInfoFetch(): Promise<XKCDComic> {
        const params = new URLSearchParams();
        if (xkcd_token) {
            params.append('id', xkcd_token);
        }
        const response = await fetch(`https://fwd.innopolis.university/api/comic?${params.toString()}`);
        return response.json();
    }

    xkcdFetchButton.addEventListener('click', async () => {
        xkcd_p!.textContent = 'Loading';
        try {
            xkcd_token = await xkcdFetch();
            xkcd_p!.textContent = xkcd_token;

            const API_fetch = await apiInfoFetch();
            const { month, day, year, alt, img, safe_title } = API_fetch;
            const date = new Date(year, month - 1, day);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            api_info_field!.textContent = safe_title;
            publication_date!.textContent = `${formattedDate} (${formatDistanceToNow(date, { addSuffix: true })})`;
            comic_img!.src = img;
            comic_img!.alt = alt;
        } catch (error) {
            xkcd_p!.textContent = 'Error loading comic';
        }
    });
});
