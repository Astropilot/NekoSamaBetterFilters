const genreTags = document.querySelectorAll('.ui.tag > a.item');

genreTags.forEach(genreTag => {
  const filters = decodeURI(genreTag.href.split('#')[1]);
  const genres = JSON.parse(filters).genres;
  const filterGenre = new URLSearchParams();
  filterGenre.set('genres', genres);
  genreTag.href = '/anime?' + filterGenre.toString();
});
