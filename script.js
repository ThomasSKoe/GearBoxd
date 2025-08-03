
let allCars = [];

fetch('cars.json')
    .then(response => response.json())
    .then(carData => {
        console.log("Car data loaded:", carData);

        allCars = carData;
        renderCards(allCars);

        //determines all the unique brands
        const uniqueMakes = [...new Set(carData.map(car => car.make))];
        console.log(uniqueMakes);

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

    //creates seperate divs for styling
    const makeEl = document.createElement("div");
    makeEl.innerText = car.make;

    const modelEl = document.createElement("div");
    modelEl.innerText = car.model;

    const yearEl = document.createElement("div");
    yearEl.innerText = car.year;

    makeEl.classList.add("make");
    modelEl.classList.add("model");
    yearEl.classList.add("year");

    card.appendChild(makeEl);
    card.appendChild(modelEl);
    card.appendChild(yearEl);

    // card.innerText = `${car.make} ${car.model} ${car.year}`

    return card
}

//handles what to do when select is changes
function handleSelect() {
    const selectedMake = this.value;

    //makes it so it doesnt updated until the user selects something
    if (!selectedMake) return;

    getModelsByMake(selectedMake);
    console.log(selectedMake);

}

//gets all the models from one brand
function getModelsByMake(getMake) {
    if(getMake == "any") {
        renderCards(allCars);
    } else {
    const models = allCars.filter(car => car.make == getMake);
    renderCards(models);
    }

}


