let cl = console.log;

const BASE_URL = `https://crud-firebase-e248a-default-rtdb.firebaseio.com/`;
const MOVIE_URL = `${BASE_URL}/movies1.json`
const $ = function (selector) {
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
    if (rating >= 6) {
        return 'badge badge-success';
    } else if (rating < 6 && rating >= 3) {
        return 'badge badge-warning'
    } else {
        return 'badge badge-danger'
    }
}
//=====================================================================================
function objtoArr(res) {
    let data = Object.entries(res);
    return data.map(arr => {
        let obj = {
            id: arr[0],
            ...arr[1],
        }
        return obj;
    })
}
//=====================================================================================

function makeApiCall(url, methodName, body) {
    let data = body ? JSON.stringify(body) : null
    return fetch(url, {
        method: methodName,
        body: data,
        headers: {
            "content-type": "application/json",
            "auth": "JWT Token"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("API Error");
            }
            return res.json();
        })
        .catch(err => {
            snackBar('unble to server connect', 'error');
        })
}
//=====================================================================================
function onMovieCardCreate(eve) {
    eve.preventDefault();
    let movieObj = {
        name: movieNameControl.value,
        image: movieImageControl.value,
        descripation: movieDesciptionControl.value,
        genre: genreControl.value,
        rating: movieRatingControl.value,
        createdDate: movieDateControl.value
    }
    makeApiCall(MOVIE_URL, "POST", movieObj)
        .then(res => {
            handleSpinner(true);
            state.movieEditId = res.name;
            state.movieArray.unshift(movieObj);
            let div = document.createElement('div');
            div.className = 'col-md-3 mt-3';
            div.id = movieObj.id;
            div.innerHTML = ` <div class="card movieCard">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4>${movieObj.name}</h4>
                                <p>Created at : ${movieObj.createdDate} </p>
                            </div>
                            <div class="col-2">
                                <span class=" text-center p-2 ${movieRating(movieObj.rating)}">${movieObj.rating}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${movieObj.image}" alt="${movieObj.name}">
                            <figcaption>
                                <h4>${movieObj.name}</h4>
                                <p>Genere : ${movieObj.genre}</p>
                                <p>${movieObj.descripation}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" onclick="onEditMovie(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button type="button" onclick="onDeleteMovie(this)" class="btn btn-sm net-pri-btn">Remove</button>
                    </div>
                </div>`
            movieContainer.prepend(div);
            // movieForm.reset();
            onToggle();
            handleSpinner();
            snackBar('MovieCard Added Successfully!!', 'success');
        })
        .catch(err => {
            handleSpinner();
            snackBar(`Unable to add movieCard`, 'error');
        })

}
//====================================================================================

movieForm.addEventListener('submit', onMovieCardCreate)