import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31620730-cb4a39b7fbcb60cc00e539a30';

async function fetchImages(name, page, per_page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
  );
  return response.data;
}
export default fetchImages;