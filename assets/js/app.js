let cl = console.log;

const $ = function(selector){
    return document.querySelector(selector);
}

const addmovie = $('#addmovie');
const movieContainer = $('#movieContainer');
const movieModel = $('#movieModel');
const movieForm = $('#movieForm');
const closeMark = $('#closeMark');
const movieNameControl = $('#movieName');
const movieImageControl = $('#movieImage');
const movieDesciptionControl = $('#movieDesciption');
const genreControl = $('#genre');
const movieRatingControl = $('#movieRating');
const movieDateControl = $('#movieDate');
const addMoviebtn = $('#addMoviebtn');
const backdrop = $('#backdrop');
const spinner = $('#spinner');
const closeBtn = $('#closeBtn');

let closeMovieModel = [...document.getElementsByClassName('closeMovieModel')];
addmovie.addEventListener('click', onToggle);
closeMovieModel.forEach(ele => {
    ele.addEventListener('click', onToggle)
})

//=====================================================================================
function onToggle() {
    movieModel.classList.toggle('active');
    backdrop.classList.toggle('active');
    movieForm.reset();
    updateMoviebtn.classList.add('d-none');
}
//======================================================================================
function snackBar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}
//=====================================================================================
function handleSpinner(flag) {
    if (flag) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}
//====================================================================================
let state = {
    movieArray: [],
    movieEditId: null
}
//=====================================================================================
function movieRating(rating) {
    if (rating >= 10) {
        return 'badge badge-success';
    } else if (rating < 6 && rating >= 4) {
        return 'badge badge-warning'
    } else {
        return 'badge badge-danger'
    }
}
//=====================================================================================