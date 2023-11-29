const COHORT = '2310-FSA-ET-WEB-PT-SF';
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF/events`;

const state = {
    parties: [],
};

const partyList = document.querySelector("#parties");
const addPartyForm = document.querySelector("#addParty");

addPartyForm.addEventListener("submit", addParty);

// Event delegation to handle delete events
partyList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-party")) {
        const partyId = event.target.dataset.partyId;
        deleteParty(partyId);
    }
});

/**
 * Sync state with the API and rerender
 */
async function render() {
    await getParties();
    renderParties();
}
render();

/**
 * Update state with parties from API
 */
async function getParties() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.parties = json.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Render parties from state
 */
function renderParties() {
    if (!state.parties.length) {
        partyList.innerHTML = "<li>No Party</li>";
        return;
    }

    const partyCards = state.parties.map((party) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h2>${party.id}</h2>
            <h2>${party.name}</h2>
            <h2>${party.description}</h2>
            <h2>${party.date}</h2>
            <h2>${party.location}</h2>
            <button class="delete-party" data-party-id="${party.id}">Delete</button>
        `;
        return li;
    });

    partyList.replaceChildren(...partyCards);
}

async function addParty(event) {
    event.preventDefault();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: addPartyForm.name.value,
                description: addPartyForm.description.value,
                date: addPartyForm.date.value,
                location: addPartyForm.location.value,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create party");
        }

        render();
    } catch (error) {
        console.error(error);
    }
}

async function deleteParty(partyId) {
    try {
        const response = await fetch(`${API_URL}/${partyId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete party");
        }

        render();
    } catch (error) {
        console.error(error);
    }
}