import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchSearch } from './js/fetchSearch';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let page = 1;
let pages = 0;
let q = "";

searchForm.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

function onSearch(event) {
    event.preventDefault();

    q = event.currentTarget.searchQuery.value;

    if (q === "") {
        gallery.innerHTML = "";
        return;
    }

    fetchSearch(q)
        .then(data => {
            if (data.hits.length === 0) {
                gallery.innerHTML = "";
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }
            if (data.hits.length > 0) {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
                
                const forCard = data.hits;
                markupCard(forCard);
            }
        })

        .catch(error => {
            Notiflix.Notify.failure('Error. Please try again.');
        })
}

function markupCard(forCard) {
    for (const item of forCard) {
                const htmlCars = `<div class="photo-card">
                                    <a href="${item.largeImageURL}">
                                        <img src="${item.webformatURL}" alt="" loading="lazy" width="250px" heigth="250px"/></a>
                                    <div class="info">
                                        <p class="info-item"><b>Likes</b><br>${item.likes}</p>
                                        <p class="info-item"><b>Views</b><br>${item.views}</p>
                                        <p class="info-item"><b>Comments</b><br>${item.comments}</p>
                                        <p class="info-item"><b>Downloads</b><br>${item.downloads}</p>
                                    </div>
                                </div> `
                gallery.innerHTML += htmlCars;
    }
    let lightbox = new SimpleLightbox('.photo-card a', {});
}

async function onLoadMore() {
    page += 1;
    const response = await fetchSearch(q, page);
    markupCard(response.hits);
    pages += response.hits.length;

    if (pages === response.totalHits) {
        loadMoreBtn.className.add('is-hidden');
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }
}