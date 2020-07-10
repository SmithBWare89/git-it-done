// Variables to store user input
const userFormEl = document.querySelector("#user-form");
const nameInputEl = document.querySelector("#username");
const languageButtonsEl = document.querySelector("#language-buttons");

// Variables for displaying repos on website
const repoContainerEl = document.querySelector("#repos-container");
const repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {
      // format the github api url
        var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url
  fetch(apiUrl)
    .then(function(response) {
      // If there is a valid response
      if (response.ok) {
        response.json().then(function(data) {
          displayRepos(data, user);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to GitHub");
    });};

// Event handler upon form submit
var formSubmitHandler = function(event) {
  // Prevents form from refreshing page on submit
  event.preventDefault();

  // get value from input element
  var username = nameInputEl.value.trim();
  console.log(username)
  console.log(typeof username)

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
};

var displayRepos = function(repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }

  
  console.log(repos);
  console.log(searchTerm);
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html");

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};

async function getFeaturedRepos (language) {
  try {
    let apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    let unformattedAPIResponse = await fetch(apiUrl);
    let apiResponse = await unformattedAPIResponse.json();
    return displayRepos(apiResponse.items, language);
  } catch (err){
    alert("Error: " + apiResponse.statusText);
  }
};

function buttonClickHandler(event){
  let buttonClicked = event.target.getAttribute("data-language");
  if (buttonClicked) {
    getFeaturedRepos(buttonClicked);

    // clear old content
    repoContainerEl.textContent = "";
  }
}

// Adds submit event listener to run the function
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);