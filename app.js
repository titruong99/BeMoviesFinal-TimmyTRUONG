let page=document.querySelector(".page"); /* var pour toute la page */
let overlay=document.querySelector(".overlay"); /* var pour l'overlay quand un modal apparait */

let hoverImages=document.querySelectorAll(".hoverImage"); /* ---!!! var quand on hover un movie pour avoir les infos courtes du film !!!--- */
let popUpDetailsMovie=document.querySelector(".dialogMovie"); /* var pour le popup movie */

let registers=document.querySelectorAll(".register"); /* début var pour le popup register/login */
let signIns=document.querySelectorAll(".signin"); 
let popUpSignIn=document.querySelector(".popUpSignIn"); 
let confirmLogin=document.querySelector(".confirmLogin");
let labelSignUp=document.querySelector(".labelSignUp");
let labelLogin=document.querySelector(".labelLogin"); /* fin var pour le popup register/login */

let selectedGenre=document.querySelector(".genre-selected"); /* var pour le dernier swiper quand on choisi le genre */

let genresMovies=document.querySelector(".genres"); /* var pour les diff genres */
let dialogGenres=document.querySelector(".dialogGenres");
let popUpGenres=document.querySelector(".popUpGenres");
let genreChosen;


/* array de tous les genres */
const genreMap = {
  28: 'Action',
  12: 'Aventure',
  16: 'Animation',
  35: 'Comédie',
  80: 'Crime',
  99: 'Documentaire',
  18: 'Drame',
  10751: 'Famille',
  14: 'Fantastique',
  36: 'Histoire',
  27: 'Horreur',
  10402: 'Musique',
  9648: 'Mystère',
  10749: 'Romance',
  878: 'Science-Fiction',
  10770: 'Téléfilm',
  53: 'Thriller',
  10752: 'Guerre',
  37: 'Western'
};
let categories=Object.entries(genreMap);

/* ---!!! les films search par la barre de recherche !!!--- */

let searchMoviesContainer = document.querySelector(".searched-movies");
let researchBar = document.querySelector("#input-research-movie");
let researchBtn = document.querySelector(".btn-research-movie");
let swiperSearch = document.querySelector(".searched-movies .swiper");
let swiperWrapperSearch = document.querySelector(".searched-movies .swiper .swiper-wrapper");
let researchParag = document.querySelector(".research-parag"); /* var pour changer le  */
let wrongResearch;

const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const apiKey = "be3a85fe71718ce8fc3ac8557fe5001d";
const apiUrlSearch = 'https://api.themoviedb.org/3/search/movie';

researchBtn.addEventListener('click', () => {
  const recherche = researchBar.value.trim();
  if (recherche) {
      searchMoviesContainer.style.display = "block";
      fetchMovies(recherche).then(res=>{
        res.length==0?researchParag.innerText = `No results for "${recherche}"`:researchParag.innerText = `Results for "${recherche}"`;
      });
  }
});

async function fetchMovies(recherche) {
  try {
      const response = await fetch(`${apiUrlSearch}?api_key=${apiKey}&query=${encodeURIComponent(recherche)}`);
      const data = await response.json();
      displayResultsSwiper(data.results);
      return data.results;
  } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
  }
}

function displayResultsSwiper(movies) {
  swiperWrapperSearch.innerHTML = '';
  swiperSearch.style.display="block";
  if(searchMoviesContainer.lastChild==wrongResearch){
    searchMoviesContainer.removeChild(wrongResearch);
  }
  if (movies.length === 0) {
    swiperSearch.style.display="none";
    wrongResearch = document.createElement("img");
    wrongResearch.classList.add("movieImage");
    wrongResearch.src ="/images/error-results.png";
    wrongResearch.alt = "";
    wrongResearch.style.marginLeft="400px";
    searchMoviesContainer.appendChild(wrongResearch);
    return movies.length;
  }
  movies.forEach(movie => {
      let slideElement = document.createElement('div');
      slideElement.classList.add('swiper-slide');

      if (movie.poster_path) {
        let imageMovie = document.createElement("img");
        imageMovie.classList.add("movieImage");
        imageMovie.src = `${imageBaseUrl}${movie.poster_path}`;
        imageMovie.alt = movie.title;
        slideElement.appendChild(imageMovie);
      }else{
        let imageNotLoaded = document.createElement("div");
        imageNotLoaded.classList.add("imageNotLoaded");
        imageNotLoaded.alt = movie.title;

        let p=document.createElement("p");
        p.innerText="Image unavailable";

        imageNotLoaded.appendChild(p);
        slideElement.appendChild(imageNotLoaded);
        console.log("image unload");
        
      }

      let imageHover = document.createElement("div");
      imageHover.classList.add("hoverImage");

      imageHover.addEventListener("click", function () {
        showMovieModal(movie.id);
      });

      let imageHoverContent = document.createElement("div");
      imageHoverContent.classList.add("hoverImageContent");

      let movieTitle = document.createElement('h1');
      movieTitle.innerText = movie.title;

      let movieYear = document.createElement('h2');
      let releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'Inconnue';
      movieYear.innerText = `${releaseYear}`;

      let movieGenre = document.createElement("h3");
      let genres = movie.genre_ids.map(id => genreMap[id]).filter(Boolean).join(' / ');
      movieGenre.innerText = `${genres || 'Inconnus'}`;

      let divRating = document.createElement("div");

      let imgRating = document.createElement("img");
      imgRating.src = "images/rateStar.png";
  
      let scoreRating = document.createElement("h4");
      scoreRating.innerText = movie.vote_average.toFixed(1);
  
      divRating.appendChild(imgRating);
      divRating.appendChild(scoreRating);
  
      imageHoverContent.appendChild(movieTitle);
      imageHoverContent.appendChild(movieYear);
      imageHoverContent.appendChild(movieGenre);
      imageHoverContent.appendChild(divRating);

      imageHover.appendChild(imageHoverContent);
      
      slideElement.appendChild(imageHover);
      
      swiperWrapperSearch.appendChild(slideElement);

      const swiper = new Swiper('.swiper', {
        slidesPerView: 4, 
        direction: 'horizontal',
        loop: true,
        spaceBetween:-2,
      
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
    });
  });
}


/* ---!!! les derniers films sortis !!!--- */

const apiUrlLatest = 'https://api.themoviedb.org/3/movie/now_playing';

let swiperWrapperLatest = document.querySelector(".latest-movies .swiper .swiper-wrapper");

async function fetchLatestMovies() {
  try {
      const response = await fetch(`${apiUrlLatest}?api_key=${apiKey}&language=fr-FR&page=1`);
      const data = await response.json();
      displayMoviesInSwiper(data.results.slice(0, 20)); // Afficher les 20 derniers films
  } catch (error) {
      console.error('Erreur lors de la récupération des films récents:', error);
  }
}

function displayMoviesInSwiper(movies) {
  movies.forEach(movie => {
      let slideElement = document.createElement('div');
      slideElement.classList.add('swiper-slide');

      if (movie.poster_path) {
        let imageMovie = document.createElement("img");
        imageMovie.classList.add("movieImage");
        imageMovie.src = `${imageBaseUrl}${movie.poster_path}`;
        imageMovie.alt = movie.title;
        slideElement.appendChild(imageMovie);
      }

      let imageHover = document.createElement("div");
      imageHover.classList.add("hoverImage");

      imageHover.addEventListener("click", function () {
        showMovieModal(movie.id);}
      );

      let imageHoverContent = document.createElement("div");
      imageHoverContent.classList.add("hoverImageContent");

      let movieTitle = document.createElement('h1');
      movieTitle.innerText = movie.title;

      let movieYear = document.createElement('h2');
      let releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'Inconnue';
      movieYear.innerText = `${releaseYear}`;

      let movieGenre = document.createElement("h3");
      let genres = movie.genre_ids.map(id => genreMap[id]).filter(Boolean).join(' / ');
      movieGenre.innerText = `${genres || 'Inconnus'}`;

      let divRating = document.createElement("div");

      let imgRating = document.createElement("img");
      imgRating.src = "images/rateStar.png";

      let scoreRating = document.createElement("h4");
      scoreRating.innerText = movie.vote_average.toFixed(1);

      divRating.appendChild(imgRating);
      divRating.appendChild(scoreRating);

      imageHoverContent.appendChild(movieTitle);
      imageHoverContent.appendChild(movieYear);
      imageHoverContent.appendChild(movieGenre);
      imageHoverContent.appendChild(divRating);

      imageHover.appendChild(imageHoverContent);
      
      slideElement.appendChild(imageHover);

      swiperWrapperLatest.appendChild(slideElement);

      const swiper = new Swiper('.swiper', {
        slidesPerView: 4, 
        direction: 'horizontal',
        loop: true,
        spaceBetween:-2,
      
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
  });
}

fetchLatestMovies();


/* ---!!! les films par genre !!!--- */

const apiUrlGenres = 'https://api.themoviedb.org/3/genre/movie/list';
const apiUrlmovies = 'https://api.themoviedb.org/3/discover/movie';

let swiperWrapperGenres = document.querySelector(".movies-genre .genres .swiper-container-genres .swiper-wrapper-genres");
let swiperWrapperMoviesGenre = document.querySelector(".movies-genre .movies .swiper .swiper-wrapper");

async function fetchGenres() {
  try {
      const response = await fetch(`${apiUrlGenres}?api_key=${apiKey}&language=fr-FR`);
      const data = await response.json();
      createGenres();
  } catch (error) {
      console.error('Erreur lors de la récupération des genres:', error);
  }
}

const updateGenreChosen=(name,p)=>{
  selectedGenre.innerText=name;
  genreChosen.classList.remove("genre-chosen");
  p.classList.add("genre-chosen");
  genreChosen=p;
}

const creatFirstGenres=()=>{
  for(let i=0;i<6;i++){
    let p=document.createElement("p");
    p.innerText=categories[i][1];
    p.classList.add("genre");
    p.addEventListener('click', () =>{
      updateGenreChosen(categories[i][1],p)
      fetchMoviesByGenre(categories[i][0]);
    });
    if(i==0){
      genreChosen=p;
      p.classList.add("genre-chosen");
    }
    genresMovies.append(p);
  }
}

const createOtherContent=(categories)=>{
  if(popUpGenres.children.length==0){
    for(let i=0;i<categories.length;i++){
      let p=document.createElement("p");
      p.innerText=categories[i][1];
      p.classList.add("genre");
      p.addEventListener('click', () =>{
        updateGenreChosen(categories[i][1],p)
        fetchMoviesByGenre(categories[i][0]);
        dialogGenres.close();
        overlay.style.display = "none";
        document.body.style.overflow = 'auto';
      });
      popUpGenres.append(p);
    }
  }
}

const createOtherParagraph=(categories)=>{
  let other=document.createElement("p");
  other.innerText="...";
  other.classList.add("genre");
  other.addEventListener("click",e=>{
    createOtherContent(categories);
    dialogGenres.showModal();
    overlay.style.display = "block";
    document.body.style.overflow = 'hidden';
    document.querySelector(".closeDialogGenres").addEventListener("click",e=>{
      dialogGenres.close();
      overlay.style.display = "none";
      document.body.style.overflow = 'auto';
    })
  });
  genresMovies.append(other);
}

const createGenres=()=>{
  selectedGenre.innerText=categories[0][1];
  fetchMoviesByGenre(categories[0][0])
  creatFirstGenres(categories);
  createOtherParagraph(categories.slice(6));
}

async function fetchMoviesByGenre(genreId) {
  try {
      const response = await fetch(`${apiUrlmovies}?api_key=${apiKey}&with_genres=${genreId}&language=fr-FR`);
      const data = await response.json();
      displayMovies(data.results);
  } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
  }
}

function displayMovies(movies) {
  swiperWrapperMoviesGenre.innerHTML = '';
  movies.forEach(movie => {
    let slideElement = document.createElement('div');
    slideElement.classList.add('swiper-slide');

    if (movie.poster_path) {
      let imageMovie = document.createElement("img");
      imageMovie.classList.add("movieImage");
      imageMovie.src = `${imageBaseUrl}${movie.poster_path}`;
      imageMovie.alt = movie.title;
      slideElement.appendChild(imageMovie);
    }

    let imageHover = document.createElement("div");
    imageHover.classList.add("hoverImage");

    imageHover.addEventListener("click", function () {
      showMovieModal(movie.id);
    });

    let imageHoverContent = document.createElement("div");
    imageHoverContent.classList.add("hoverImageContent");

    let movieTitle = document.createElement('h1');
    movieTitle.innerText = movie.title;

    let movieYear = document.createElement('h2');
    let releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'Inconnue';
    movieYear.innerText = `${releaseYear}`;

    let movieGenre = document.createElement("h3");
    let genres = movie.genre_ids.map(id => genreMap[id]).filter(Boolean).join(' / ');
    movieGenre.innerText = `${genres || 'Inconnus'}`;

    let divRating = document.createElement("div");

    let imgRating = document.createElement("img");
    imgRating.src = "images/rateStar.png";

    let scoreRating = document.createElement("h4");
    scoreRating.innerText = movie.vote_average.toFixed(1);

    divRating.appendChild(imgRating);
    divRating.appendChild(scoreRating);

    imageHoverContent.appendChild(movieTitle);
    imageHoverContent.appendChild(movieYear);
    imageHoverContent.appendChild(movieGenre);
    imageHoverContent.appendChild(divRating);

    imageHover.appendChild(imageHoverContent);
    
    slideElement.appendChild(imageHover);

    swiperWrapperMoviesGenre.appendChild(slideElement);
  });

  const swiper = new Swiper('.swiper', {
    slidesPerView: 4, 
    direction: 'horizontal',
    loop: true,
    spaceBetween:-2,
  
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

fetchGenres();

const changeElementsForLabelLogin=()=>{
  labelSignUp.style.backgroundColor="black";
  labelSignUp.style.borderTop = '1px solid white';
  labelSignUp.style.borderLeft = '1px solid white';
  labelSignUp.style.borderBottom = '1px solid white';

  labelLogin.style.backgroundColor="red";
  labelLogin.style.border ="none";
  confirmLogin.innerText="LOGIN";
}


const changeElementsForLabelSignUp=()=>{
  labelLogin.style.backgroundColor="black";
  labelLogin.style.borderTop = '1px solid white';
  labelLogin.style.borderRight = '1px solid white';
  labelLogin.style.borderBottom = '1px solid white';

  labelSignUp.style.backgroundColor="red";
  labelSignUp.style.border ="none";
  confirmLogin.innerText="SIGNUP";
}


const createModalLogin=(newUser)=>{
  if(newUser){
    changeElementsForLabelSignUp();
  }else{
    changeElementsForLabelLogin();
  }
  popUpSignIn.showModal();
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  document.querySelector(".closePopUpSignIn").addEventListener("click",e=>{
    popUpSignIn.close();
    overlay.style.display = "none";
    document.body.style.overflow = 'auto';
  })
}



async function getMovieDetails(movieId) {
  const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR`;
  const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=fr-FR`;
  
  const [movieResponse, creditsResponse] = await Promise.all([
      fetch(movieUrl),
      fetch(creditsUrl)
  ]);

  const movieData = await movieResponse.json();
  const creditsData = await creditsResponse.json();

  return { movieData, creditsData };
}

async function showMovieModal(movieId) {
  const { movieData, creditsData } = await getMovieDetails(movieId);

  document.querySelector(".imagePopUpMovie").src = `${imageBaseUrl}${movieData.poster_path}`;
  document.querySelector(".movieTitle").innerText = movieData.title;
  document.querySelector('.movieYear').innerText = movieData.release_date ? movieData.release_date.split('-')[0] : 'Inconnue';
  document.querySelector('.note').innerText = movieData.vote_average.toFixed(1);
  document.querySelector('.movieGenre').innerText =  movieData.genres.map(g => g.name).join(' / ');
  document.querySelector('.movieDescription').innerText = movieData.overview;

  // Afficher les acteurs principaux (maximum 5)
  const cast = document.querySelector('.actors');
  let fiveActors = creditsData.cast.slice(0, 5);
  cast.innerHTML = `${fiveActors[0].name}, ${fiveActors[1].name}, ${fiveActors[2].name}, ${fiveActors[3].name}, ${fiveActors[4].name}`;

  popUpDetailsMovie.showModal();
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  document.querySelector(".closeDialogMovie").addEventListener("click",e=>{
    popUpDetailsMovie.close();
    overlay.style.display = "none";
    document.body.style.overflow = 'auto';
  })
}

signIns.forEach(elem=>elem.addEventListener("click",e=>{
  createModalLogin(false);
}))

registers.forEach(elem=>elem.addEventListener("click",e=>{
  createModalLogin(true);
}))

labelSignUp.addEventListener("click",e=>{
  changeElementsForLabelSignUp();
})

labelLogin.addEventListener("click",e=>{
  changeElementsForLabelLogin();
})


//vider la barre de recherche à chaque fois qu'on load la page
window.onload = function() {
  researchBar.value = '';
};

