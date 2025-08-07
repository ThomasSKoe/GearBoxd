
let allCars = [];

let currentUser = null;

const userStatus = document.getElementById("userStatus");

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        const username = user.email.split("@")[0];
        userStatus.textContent = `Logged in as: ${username}`;
    } else {
        currentUser = null;
        userStatus.textContent = "Browsing as Guest, ratings will be stored in local storage";
    }


    fetch('cars.json')
        .then(response => response.json())
        .then(carData => {

            allCars = carData;
            renderCards(allCars);

            //determines all the unique brands
            const uniqueMakes = [...new Set(carData.map(car => car.make))];

            //makes the select brand/make dropdown
            const makeSelect = document.getElementById("makeSelect");
            uniqueMakes.forEach(make => {
                const option = document.createElement("option");
                option.value = make;
                option.textContent = make;
                makeSelect.appendChild(option);
            });


        })
        .catch(error => {
            console.error("Error", error);
        });

});

const makeSelect = document.getElementById("makeSelect");
makeSelect.addEventListener("change", handleSelect);

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", handleSearch);

//handles the search function
function handleSearch() {

    const searchTerm = searchInput.value.toLowerCase();
    const filteredCars = allCars.filter(car => {
        return (
            car.model.toLowerCase().includes(searchTerm)
        );
    });

    renderCards(filteredCars);

}

//renders what cars are on screen based on what list is inputted
function renderCards(carList) {

    const carCards = document.getElementById("carList");

    carCards.innerHTML = "";

    carList.forEach(car => {
        const card = createCard(car);
        carCards.appendChild(card);
    });

}

//creates a card based on the car
function createCard(car) {
    const card = document.createElement("div");
    card.classList.add("carCard");


    const ratingContainer = document.createElement("div");
    ratingContainer.classList.add("ratingContainer");

    const carIdKey = `${car.make}-${car.model}-${car.year}`.toLowerCase().replace(/\s+/g, '-');


    //creates the buttons
    for (let i = 1; i < 11; i++) {
        const ratingButton = document.createElement("button");
        ratingButton.classList.add("ratingButton");
        ratingButton.textContent = i;

        ratingButton.addEventListener("click", () => {

            const allButtons = ratingContainer.querySelectorAll(".ratingButton");
            allButtons.forEach(btn => btn.classList.remove("selected"));
            ratingButton.classList.add("selected");


            //stores the selected value in localstorage if not logged in
            if (currentUser) {
                const db = firebase.firestore();
                const ratingRef = db.collection("ratings").doc(currentUser.uid);

                ratingRef.set({
                    [carIdKey]: i
                }, { merge: true })
                    .then(() => console.log("firestore rating saved:", carIdKey, i))
                    .catch(err => console.error("firestore error:", err));
            } else {
                localStorage.setItem(carIdKey, i);
                console.log("localStorage rating saved:", carIdKey, i);
            }


        });
        ratingContainer.appendChild(ratingButton);
    }


    //takes the ratings form local storage and saves across accesses
    if (currentUser) {
        const db = firebase.firestore();
        const ratingRef = db.collection("ratings").doc(currentUser.uid);

        ratingRef.get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    const savedRating = data[carIdKey];
                    if (savedRating) {
                        const selectedButton = ratingContainer.querySelector(`.ratingButton:nth-child(${savedRating})`);
                        if (selectedButton) selectedButton.classList.add("selected");
                    }
                }
            })
            .catch(err => console.error("Firestore fetch error:", err));
    } else {
        const savedRating = localStorage.getItem(carIdKey);
        if (savedRating) {
            const selectedButton = ratingContainer.querySelector(`.ratingButton:nth-child(${savedRating})`);
            if (selectedButton) selectedButton.classList.add("selected");
        }
    }


    card.appendChild(ratingContainer);



    const likedKey = `liked-${carIdKey}`;


    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");

    const likeButton = document.createElement("button");
    likeButton.classList.add("likeButton");
    likeButton.textContent = "♡";


    if (currentUser) {
        const db = firebase.firestore();
        const ratingRef = db.collection("ratings").doc(currentUser.uid);

        ratingRef.get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data[likedKey]) {
                    likeButton.classList.add("liked");
                    likeButton.textContent = "♥️";
                }
            }
        }).catch(err => console.error("firestore like fetch error:", err));
    } else {
        const liked = localStorage.getItem(likedKey);
        if (liked === "true") {
            likeButton.classList.add("liked");
            likeButton.textContent = "♥️";
        }
    }



    likeButton.addEventListener("click", () => {
        const isLiked = likeButton.classList.toggle("liked");
        likeButton.textContent = isLiked ? "♥️" : "♡";

        if (currentUser) {
            const db = firebase.firestore();
            const ratingRef = db.collection("ratings").doc(currentUser.uid);

            ratingRef.set({
                [likedKey]: isLiked
            }, { merge: true })
                .then(() => console.log("like saved:", likedKey, isLiked))
                .catch(err => console.error("irestore like save error:", err));
        } else {
            localStorage.setItem(likedKey, isLiked);
        }
    });







    buttonContainer.appendChild(likeButton);
    card.appendChild(buttonContainer);







    const logoWrapper = document.createElement("div");
    logoWrapper.classList.add("logoWrapper");

    const logoImage = document.createElement("img");
    logoImage.classList.add("logoImage");

    const logoFile = car.make.toLowerCase().replace(/\s+/g, "-") + ".png";
    logoImage.src = `logos/${logoFile}`;
    logoImage.alt = `${car.make} logo`;

    //default image
    logoImage.onerror = () => {
        logoImage.src = "logos/default.png";
    };

    logoWrapper.appendChild(logoImage);
    card.appendChild(logoWrapper);


    //creates seperate divs for styling
    const makeEl = document.createElement("div");
    makeEl.innerText = car.make;

    const modelEl = document.createElement("div");
    modelEl.innerText = car.model;

    const yearEl = document.createElement("div");
    yearEl.innerText = car.year;

    const statsEl = document.createElement("div");
    //seperated so i can bold hp and engine size
    statsEl.innerHTML = `HP: <span class="statValue">${car.hp}</span>,
                    Engine: <span class="statValue">${car.engine}</span>`;


    makeEl.classList.add("make");
    modelEl.classList.add("model");
    yearEl.classList.add("year");
    statsEl.classList.add("stats");

    card.appendChild(makeEl);
    card.appendChild(modelEl);
    card.appendChild(yearEl);
    card.appendChild(statsEl);

    // card.innerText = `${car.make} ${car.model} ${car.year}`

    return card
}

//handles what to do when select is changes
function handleSelect() {
    const selectedMake = this.value;

    //makes it so it doesnt updated until the user selects something
    if (!selectedMake) return;

    getModelsByMake(selectedMake);

}

//gets all the models from one brand
function getModelsByMake(getMake) {
    if (getMake == "any") {
        renderCards(allCars);
    } else if (getMake == "favorites") {
        filterFavorites();
    } else {
        const models = allCars.filter(car => car.make == getMake);
        renderCards(models);

    }

}




function filterFavorites() {
    const likedKeys = new Set();

    if (currentUser) {
        const db = firebase.firestore();
        const ratingRef = db.collection("ratings").doc(currentUser.uid);

        ratingRef.get().then(doc => {
            if (doc.exists) {
                const data = doc.data();

                Object.keys(data).forEach(key => {
                    if (key.startsWith("liked-") && data[key] === true) {
                        likedKeys.add(key.replace("liked-", ""));
                    }
                });

                const likedCars = allCars.filter(car => {
                    const key = `${car.make}-${car.model}-${car.year}`.toLowerCase().replace(/\s+/g, '-');
                    return likedKeys.has(key);
                });

                renderCards(likedCars);
            }
        }).catch(err => console.error("error fetching favorites:", err));
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("liked-") && localStorage.getItem(key) === "true") {
                likedKeys.add(key.replace("liked-", ""));
            }
        }

        const likedCars = allCars.filter(car => {
            const key = `${car.make}-${car.model}-${car.year}`.toLowerCase().replace(/\s+/g, '-');
            return likedKeys.has(key);
        });

        renderCards(likedCars);
    }
}









