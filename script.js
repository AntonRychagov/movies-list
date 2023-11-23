const MAX_VALUE_TITLE = 30;
const HIDDEN_CLASSNAME = "btn__hidden";

const inputMoviesNode = document.querySelector("#inputMovies");
const buttonGetMoviesNode = document.querySelector("#btnGetMovies");
const movieListNode = document.querySelector("#movieList");

let movies = []; // массив фильмов

//нажатие на ENTER
document.addEventListener("keypress", keypressEnter);

inputMoviesNode.addEventListener("input", validation);

buttonGetMoviesNode.addEventListener("click", addMovie);

movieListNode.addEventListener("click", doneMovie);

movieListNode.addEventListener("click", deleteMovie);

/////////////////  КОНСТАНТЫ  //////////////////////

//очищает поле ввода
const clearInputValue = () => {
  inputMoviesNode.value = "";
};

//кнопка не активна
const trueButton = () => {
  buttonGetMoviesNode.disabled = true;
  buttonGetMoviesNode.classList.add(HIDDEN_CLASSNAME);
};

//кнопка активна
const falseButton = () => {
  buttonGetMoviesNode.disabled = false;
  buttonGetMoviesNode.classList.remove(HIDDEN_CLASSNAME);
};

////////////////  ФУНКЦИИ  /////////////////

function addMovie(event) {
  event.preventDefault();

  const nameMovie = inputMoviesNode.value;

  validation(nameMovie);

  const newMovie = {
    id: Date.now(),
    name: nameMovie,
    done: false,
  };

  movies.push(newMovie);

  renderMovies();

  clearInputValue();

  trueButton();

  saveToLocalStorage();
}

//функция запускается по умолчанию при старте страницы
init();

//создаем HTML разметку со списком фильмов
const renderMovies = () => {
  movieListNode.innerHTML = "";

  movies.forEach((movie) => {
    const movieItem = document.createElement("li");
    const movieBox = document.createElement("div");
    const moviecheck = document.createElement("div");
    const span = document.createElement("span");
    const button = document.createElement("button");

    movieItem.className = "movie__item";
    movieBox.className = "movie__inner";
    moviecheck.className = "movie__checkbox";
    span.className = "movie__title";
    button.className = "btn__cross";

    movieItem.id = movie.id;

    //проверка состояния done 
    const movieActive = movie.done ? "movie__item active" : "movie__item";
    movieItem.className = movieActive;

    //проверка состояния done 
    const movieChecked = movie.done
      ? "movie__checkbox checked"
      : "movie__checkbox";
    moviecheck.className = movieChecked;

    span.innerText = movie.name;
    movieItem.setAttribute("data-action", "done");
    button.setAttribute("data-action", "delete");

    movieListNode.appendChild(movieItem);
    movieItem.appendChild(movieBox);
    movieBox.appendChild(moviecheck);
    movieBox.appendChild(span);
    movieItem.appendChild(button);
  });
};

//стартовая функция
function init() {
  inputMoviesNode.focus();
  inputMoviesNode.addEventListener("input", validation);
  trueButton();
}

//функция нажатия по клавише ENTER
function keypressEnter(e) {
  if (e.key === "Enter") {
    document.querySelector("#btnGetMovies").click();
  }
}

//функция проверки поля ввода
function validation() {
  const input = inputMoviesNode.value.trim().length;
  if (input === 0 || input === "" || input > MAX_VALUE_TITLE) {
    trueButton();
  } else {
    falseButton();
  }
}

//отмечает фильм (ПРОСМОТРЕННО)
function doneMovie(e) {
  //проверяем клик по элементу li
  if (e.target.dataset.action === "done") {
    //находим родитель с классом li
    const parentNode = e.target.closest("li");
    //в массиве сравниваем равенство по ID 
    const movie = movies.find((movie) => movie.id === Number(parentNode.id));
    //меняем состояние элемента
    movie.done = !movie.done;
    //добавляем-убираем класс 
    parentNode.classList.toggle("active");
    //находим элемент div для добавления класса
    const movieChecked = parentNode.querySelector(".movie__checkbox");
    //добавляем-убираем класс 
    movieChecked.classList.toggle("checked");
    //отрисовываем разметку
    renderMovies();
    saveToLocalStorage();
  }
}

//удаляет фильм из списка
function deleteMovie(e) {
  //проверяем клик по кнопке удалить
  if (e.target.dataset.action === "delete") {
    //находим родитель с классом 'li'
    const parentNode = e.target.closest("li");
    //фильтруем массив
    let filtered = movies.filter((movie) => movie.id !== Number(parentNode.id));
    //приравниваем результат фильтрации
    movies = filtered;
    //отрисовываем разметку
    renderMovies();
    saveToLocalStorage();
  }
}

//сохраняем в LS
function saveToLocalStorage () {
    localStorage.setItem('movies', JSON.stringify(movies));
}

//получаем значение 'movies' с хранилища браузера 
if (localStorage.getItem('movies')){
    // преобразуем JSON строку в обьект JS
    movies = JSON.parse(localStorage.getItem('movies')); 
    //Рендер из LS
    movies.forEach((movie) => renderMovies(movie));
}