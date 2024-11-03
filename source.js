const display = document.querySelector("#page");
const ShowJobs = document.querySelector("#showJobs");
let ArrFavoriteJobs = JSON.parse(localStorage.getItem("favorietsJobs")) || [];
let arrayJobs = []
function DisplayPage() {
    display.innerHTML = '';
    display.innerHTML = `
    <h2>Welcome to our site, search jobs</h2>`;
}
//spiner
function showSpinner() {
    document.getElementById("spinner").style.display = "block";
}

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}

const url = "https://remotive.com/api/remote-jobs?limit=20";

async function GetAllJobs() {
    showSpinner()
    try {
        const response = await fetch(url);
        const data = await response.json();
        arrayJobs = data.jobs;
        console.log(arrayJobs)
        BuildJob(); 
    } catch (error) {
        console.log(error);
    }
    hideSpinner()
}

function BuildJob(arr = arrayJobs) {
    display.innerHTML = '';
    display.innerHTML = `
    <div class="container mt-5 ">
        <div class="row"></div>
    </div>`;
    
    const row = document.querySelector(".row");

    arr.forEach(Job => {
        const Isexsist = ArrFavoriteJobs.findIndex((fav) => fav.id == Job.id);
        const addbtn = `<button onclick="AddFavorite('${encodeURIComponent(JSON.stringify(Job)).replaceAll("'", "")}')" class="btn btn-outline-primary btn-sm me-2">Save this JOB</button>`;
        const deletebtn = `<button onclick="RemoveFavorite('${Isexsist}')" class="btn btn-danger btn-sm">Remove</button>`;
        
        row.innerHTML += `
        <div class="col-md-4">
            <div class="card h-100 text-center">
                <div class="card-body d-flex flex-column align-items-center">
                    <h6 class="card-title company-name mb-3">Company Name: ${Job.company_name}</h6>
                    <img src="${Job.company_logo}" alt="${Job.company_name}" class="company-logo mb-3">
                    <h6 class="card-subtitle mb-2 text-muted"><a href="#">${Job.title}</a></h6>
                    <p class="card-text"><strong>Salary: ${Job.salary}</strong></p>
                    <div class="scrollable-description mb-3 w-100">
                        <p class="card-text">${Job.description}</p>
                    </div>
                    <div class="mt-auto">
                        ${Isexsist !== -1 ? deletebtn : addbtn}
                        <button class="btn btn-success btn-sm">See this JOB</button>
                    </div>
                    <p class="mt-2 mb-0"><small class="text-muted">Type: ${Job.job_type}</small></p>
                </div>
            </div>
        </div>`;
    });
}

function AddFavorite(Job) {
    const favoriteJob = JSON.parse(decodeURIComponent(Job));
    ArrFavoriteJobs.push(favoriteJob)
    SaveLocalStorage();

    setPage(localStorage.getItem("page"))

    
}

function setPage(isPage) {
    
    if (isPage === "alljobs") GetAllJobs();
    else if (isPage === "category")  BuildJob(filteredJobs)
    else if (isPage=== "search")  BuildJob(selectedSearch)  

    else BuildJob(ArrFavoriteJobs);
           
    savePageInLocal(isPage)
    
}


function RemoveFavorite(index) {
    ArrFavoriteJobs.splice(index, 1);
    SaveLocalStorage();
    setPage(localStorage.getItem("page"))


}
function savePageInLocal(Page){
    localStorage.setItem("page",Page)
}


function SaveLocalStorage() {
    localStorage.setItem("favorietsJobs", JSON.stringify(ArrFavoriteJobs));
}


//Category
DisplayPage();



const urlCategory = "Categories.json"
const categories = document.querySelector("#Categories")

async function GetCategory() {
    try{
       const res = await fetch(urlCategory)
       const data = await res.json()
       const arrCategories = data.jobs
       console.log(arrCategories)
       DropdownMenu(arrCategories)
}   catch(error){
    console.log("there is a problem. check it.",error)
}

}

function DropdownMenu(arrCategories){
    categories.innerHTML = ''
    arrCategories.forEach(category =>{
        categories.innerHTML += `
        <li><a onclick="displayCategory('${category.name}')" class="dropdown-item" href="#">${category.name}</a></li>
    `

    })
}


let filteredJobs = [];//הגדרת  משתנה גלובלי
async function displayCategory(selectedCategory) {
    await GetAllJobs() //הוספתי את async וawait כדי שאם הוא יכנס בהתחלה לקטגוריות הוא קודם יטען את כל המשרות מהapi
   
    filteredJobs = arrayJobs.filter(job => job.category === selectedCategory);   
    BuildJob(filteredJobs);
    savePageInLocal('category')
}
GetCategory()

//search
let selectedSearch;//הגדרת משתנה גלובלי
const inputValue = document.querySelector("#input")

async function SearchInput(){
    await GetAllJobs()//הוספתי את async וawait כדי שאם הוא יכנס בהתחלה לקטגוריות הוא קודם יטען את כל המשרות מהapi
    selectedSearch = arrayJobs.filter((job) => job.title.includes(inputValue.value))
    console.log(selectedSearch )
    BuildJob(selectedSearch)
    savePageInLocal('search')
}
