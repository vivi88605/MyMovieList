const BASE_URL = `https://webdev.alphacamp.io`
const INDEX_URL = BASE_URL + `/api/movies/`
const POSTER_URL = BASE_URL + `/posters/`

const dataPanel = document.querySelector('#data-panel')
const movieModal = document.querySelector('#movie-modal')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const movieList = []
let filteredMovies = []
const moviesPerPage = 12


/*    ----ALTER LIST----    */
//make userList from API
axios.get(INDEX_URL).then((response) => {
  let movies = response.data.results
  movieList.push(...movies)
  renderPaginator(movieList.length)
  renderList(getMoviesByPage(1))
})
  .catch((err) => console.log(err))

//make currentList from currentPage
function getMoviesByPage(page) {
  if (filteredMovies.length === 0) {
    data = movieList
  } else {
    data = filteredMovies
  }
  // const data = filteredMovies.length ? filteredMovies : movieList
  const startIndex = (page - 1) * moviesPerPage
  return data.slice(startIndex, startIndex + moviesPerPage)
}

//add movies to favoriteList when add button clicked
function addToFavorite(id) {
  const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || []//favoriteMovies沒有東西的話就回傳空陣列
  const movie = movieList.find((movie) => movie.id === id)//.fiind(陣列)回傳第一個函示結果為true的元素
  if (favoriteMovies.some((movie) => movie.id === id)) {//.some(陣列)檢查陣列中是否有符合函式的元素，有的話回傳true
    return alert('此電影已經在收藏清單中！')
  }
  favoriteMovies.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies))
}


/*    ----RENDER functions----    */
//render page from specified list
function renderList(list) {
  let rawHTML = ``
  list.forEach((item) => {//we need title and image
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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  });
  dataPanel.innerHTML = rawHTML
}

//render paginator
function renderPaginator(totalMovies) {
  let rawHTML = ``
  let totalPage = Number(Math.ceil(totalMovies / moviesPerPage))
  console.log(`totalPage:${totalPage}`)
  for (page = 1; page <= totalPage; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

//show modal when button clicked
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


/*    ----BUTTONS----    */
//info button and add button
dataPanel.addEventListener('click', function onPanelClick(event) {
  let target = event.target
  if (target.matches('.btn-show-movie')) {
    //show movie modal
    console.log(target.dataset)
    showModal(Number(target.dataset.id))
  } else if (target.matches('.btn-add-favorite')) {
    //add movie to favoriteList
    addToFavorite(Number(target.dataset.id))
  }
})

//add movies to filteredList
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  filteredMovies = []
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  for (const movie of movieList) {
    if (movie.title.toLowerCase().includes(keyword)) {
      filteredMovies.push(movie)
    }
  }
  if (filteredMovies.length === 0) {
    return alert(`"${keyword}"沒有符合的搜尋項目`)
  }
  renderPaginator(filteredMovies.length)
  renderList(getMoviesByPage(1)) //預設顯示第 1 頁的搜尋結果
})

//show movies from currentPage
paginator.addEventListener('click', function (event) {
  let target = event.target
  if (target.tagName !== 'A') return
  let currentPage = Number(target.dataset.page)
  renderList(getMoviesByPage(currentPage))
})