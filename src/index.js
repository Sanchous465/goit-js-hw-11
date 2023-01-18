import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './js/fetchImages';
import renderMarkup from './js/renderMarkup';

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const containerRef = document.querySelector('.container');
const searchForm = document.querySelector('.search-form');
const searchQuery = document.querySelector('input[name="searchQuery"]');
const loadMoreBtn = document.querySelector('.load-more');
const galleryRef = document.querySelector('.gallery');
const scrollUpRef = document.querySelector('.scroll-up');

searchForm.addEventListener('submit', onSearchImages);
loadMoreBtn.addEventListener('click', onload);
scrollUpRef.addEventListener('click', onScrollUp);

let page = 1;
let per_page = 40;
loadMoreBtn.classList.add('is-hidden');
scrollUpRef.classList.add('is-hidden');

function onSearchImages(event) {
  event.preventDefault();
  const name = searchQuery.value.trim();
  page = 1;
  if (!name) {
    return Notify.info('Please enter correct information');
  }

  fetchImages(name, page, per_page)
    .then(data => {
      galleryRef.innerHTML = '';
      renderMarkup(data.hits);
      lightbox.refresh();
      loadMoreBtn.classList.remove('is-hidden');
      scrollUpRef.classList.remove('is-hidden');

      if (!data.hits.length) {
        loadMoreBtn.classList.add('is-hidden');
        scrollUpRef.classList.add('is-hidden');
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.success(`"Hooray! We found ${data.totalHits} images."`);
      }

      onScrollUp();
    })
    .catch(error => console.log(error));
}

function onload() {
  page += 1;
  const name = searchQuery.value;
  fetchImages(name, page, per_page).then(data => {
    let totalPages = Math.ceil(data.totalHits / per_page);
    renderMarkup(data.hits);
    lightbox.refresh();
    slowScroll();

    if (page >= totalPages) {
      loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

function onScrollUp() {
  containerRef.scrollIntoView({
    behavior: 'smooth',
  });
}

function slowScroll() {
  const { height: cardHeight } =
    galleryRef.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}