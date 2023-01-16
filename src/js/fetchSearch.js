import axios from 'axios';

export async function fetchSearch(q, page) {
    const key = '17988471-599edd7bd30320e243c69934a';
    const searchParams = new URLSearchParams({
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 20,
});
    
    return await axios.get(`https://pixabay.com/api/?key=${key}&q=${q}&${searchParams}&page=${page}`)
        .then(response => response.data);
    
}