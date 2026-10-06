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
const updateMoviebtn = $('#updateMoviebtn');
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
        createdDate: new Date(movieDateControl.value).toLocaleString(),
    }
    makeApiCall(MOVIE_URL, "POST", movieObj)
        .then(res => {
            handleSpinner(true);
            state.movieEditId = res.name;
            state.movieArray.unshift(movieObj);
            let div = document.createElement('div');
            div.className = 'col-md-3 mt-3';
            div.id = res.name;
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
function fetchMovieCards() {
    handleSpinner(true);
    makeApiCall(MOVIE_URL, "GET")
        .then(res => {
            state.movieArray = objtoArr(res);
            templatingMovieCards(state.movieArray);
            handleSpinner();
            snackBar('MovieCards Fetched Successfully', 'success')

        })
        .catch(err => {
            handleSpinner();
            snackBar('unble to server connect', 'error');
        })
}
fetchMovieCards();
//====================================================================================
function templatingMovieCards(arr) {
    let result = '';
    arr.forEach(mov => {
        result += ` <div class="col-md-3 mt-3" id="${mov.id}">
                <div class="card movieCard">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4>${mov.name}</h4>
                                <p>Created at : ${mov.createdDate}</p>
                            </div>
                            <div class="col-2">
                                <span class=" text-center p-2 ${movieRating(mov.rating)}">${mov.rating}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${mov.image}" alt="${mov.name}">
                            <figcaption>
                                <h4>${mov.name}</h4>
                                <p>Genere : ${mov.genre}</p>
                                <p>${mov.descripation}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" onclick="onEditMovie(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button type="button" onclick="onDeleteMovie(this)"  class="btn btn-sm net-pri-btn">Remove</button>
                    </div>
                </div>
            </div> `
    })
    movieContainer.innerHTML = result;
}
//==================================================================================
function onEditMovie(ele) {
    let editId = ele.closest('.col-md-3').id
    state.movieEditId = editId;
    const EDIT_URL = `${BASE_URL}/movies1/${editId}.json`;
    handleSpinner(true);
    makeApiCall(EDIT_URL, 'GET')
        .then(res => {
            cl(res);
            let oldDate = res.createdDate;
            let [datePart] = oldDate.split(',');
            // "14/10/2026"
            let [day, month, year] = datePart.split('/');
            // movieDate.value = `${year}-${month}-${day}`;
            handleSpinner();
            onToggle();
            movieNameControl.value = res.name;
            movieImageControl.value = res.image;
            movieDesciptionControl.value = res.descripation;
            movieRatingControl.value = res.rating;
            genreControl.value = res.genre;
            movieDateControl.value = `${year}-${month}-${day}`;
            addMoviebtn.classList.add('d-none');
            updateMoviebtn.classList.remove('d-none');
            closeMark.classList.add('d-none');
            closeBtn.disabled = true;
            document.querySelector('#movieForm .card-header h3').innerText = 'Edit Movie'
        })

}
//==================================================================================
function onMovieUpdate(eve) {
    let updateId = state.movieEditId;
    let editobj = state.movieArray.find(mov => mov.id === updateId);
    cl(editobj);
    cl(editobj.createdDate);
    let updateMovObj = {
        name: movieNameControl.value,
        image: movieImageControl.value,
        descripation: movieDesciptionControl.value,
        genre: genreControl.value,
        rating: movieRatingControl.value,
        createdDate: editobj.createdDate,
        updatedDate: new Date(movieDateControl.value).toLocaleString(),
        id: updateId
    }
    cl(updateMovObj);
    const UPDATE_URL = `${BASE_URL}/movies1/${updateId}.json`;
    handleSpinner(true);
    makeApiCall(UPDATE_URL, 'PATCH', updateMovObj)
        .then(res => {
            cl(res);
            let getIndex = state.movieArray.findIndex(mov => mov.id === updateId)
            state.movieArray[getIndex] = updateMovObj;
            // state.movieEditId = null;
            let div = document.getElementById(updateId);
            cl(div);
            div.innerHTML = `<div class="card movieCard">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4>${updateMovObj.name}</h4>
                                <p>Updated at : ${updateMovObj.updatedDate}</p>
                            </div>
                            <div class="col-2">
                                <span class=" text-center p-2 ${movieRating(updateMovObj.rating)}">${updateMovObj.rating}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${updateMovObj.image}" alt="${updateMovObj.name}">
                            <figcaption>
                                <h4>${updateMovObj.name}</h4>
                                <p>Genere : ${updateMovObj.genre}</p>
                                <p>${updateMovObj.descripation}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" onclick="onEditMovie(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button type="button" onclick="onDeleteMovie(this)"  class="btn btn-sm net-pri-btn">Remove</button>
                    </div>
                </div>`
            addMoviebtn.classList.remove('d-none');
            updateMoviebtn.classList.add('d-none');
            closeMark.classList.remove('d-none');
            closeBtn.disabled = false;
            document.querySelector('#movieForm .card-header h3').innerText = 'Add Movie'
            handleSpinner()
            snackBar('MovieCard Updated Successfully', 'success')
            onToggle();
        })
        .catch(err => {
            handleSpinner();
            snackBar(`Unable to update movieCard`, 'error');
        })
}


movieForm.addEventListener('submit', onMovieCardCreate);
updateMoviebtn.addEventListener('click', onMovieUpdate);