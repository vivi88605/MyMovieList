const BASE_URL = `https://webdev.alphacamp.io`
const INDEX_URL = BASE_URL + `/api/movies/`
const POSTER_URL = BASE_URL + `/posters/`
// const movieList = []
const dataPanel = document.querySelector('#data-panel')
const movieModal = document.querySelector('#movie-modal')
const movieList = JSON.parse(localStorage.getItem('favoriteMovies')) || []

function renderList(list) {
  let rawHTML = ``
  list.forEach((item) => {
    //we need title and image
    // console.log(item)
    rawHTML += `
    <div class="col-sm-3">
        <div class="m-3">
          <div class="card">
            <img src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${item.id}">info</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  });
  dataPanel.innerHTML = rawHTML
}

// axios.get(INDEX_URL).then((response) => {
//   let movies = response.data.results
//   movieList.push(...movies)
//   // console.log(movieList)
//   // renderList(movieList)
//   renderList(movieList)
// })
//   .catch((err) => console.log(err))
renderList(movieList)

function showModal(id) {
  axios.get(INDEX_URL + id).then((response) => {
    let movie = response.data.results
    movieModal.innerHTML = `
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="movie-modal-title">${movie.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="movie-modal-body">
            <div class="row">
              <div class="col-sm-8" id="movie-modal-img">
                <img src=${POSTER_URL + movie.image} alt="">
              </div>
              <div class="col-sm-4">
                <p><em id="movie-modal-date">
                    release date: ${movie.release_date}
                  </em></p>
                <p class="movie-modal-description">
                  ${movie.description}
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `
  })
}
function removeFavorite(id) {
  if (!movieList || !movieList.length) { return }//記憶體沒有東西的話不執行
  const movieIndex = movieList.findIndex((movie) => movie.id === id)
  // console.log(movieIndex)
  if (movieIndex === -1) { return }
  movieList.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movieList))
  renderList(movieList)
}

dataPanel.addEventListener('click', function onPanelClick(event) {
  let target = event.target
  if (target.matches('.btn-show-movie')) {
    console.log(target.dataset)
    // console.log(Number(target.dataset.id))
    showModal(Number(target.dataset.id))
  }
  else if (target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(target.dataset.id))
  }
})

console.log(movieList)