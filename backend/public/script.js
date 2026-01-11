console.log("scrip2t.js")

async function displayUsers() {
    const response = await fetch("/users")
    const users = await response.json()
    console.log(users)


    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = ""

    for (const user of users) {
        const newRow = document.createElement('tr');
        //    <td>${prenom}</td>
        //                 <td>${email}</td>
        newRow.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nom}</td>
            <td>${user.prenom}</td>
            <td>${user.email}</td>
            <td>${user.pseudo}</td>
            <td>${user.createdAt}</td>
            <td><button onclick="deleteUser(${user.id})">Delete</button></td>
            `;

        tableBody.appendChild(newRow);
    }

}


document.addEventListener("DOMContentLoaded", async () => {
    await displayUsers()
})

async function addUser(user) {
    const response = await fetch("/users", {
        method: "POST",
        headers: {
            ['Content-Type']: "application/json"
        },
        body: JSON.stringify(user)
    })
    const result = await response.json()
    console.log("REsult", result)
}

async function deleteUser(id) {
    console.log("delete", id)
    const response = await fetch("/users", {
        method: "DELETE",
        headers: {
            ['Content-Type']: "application/json"
        },
        body: JSON.stringify({ id: id })
    })
    const result = await response.json()
    console.log("REsult", result)
    await displayUsers()
}


const form = document.getElementById('userForm')
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("submit")
    const currentTarget = e.currentTarget
    const formData = new FormData(currentTarget)
    // console.log("formdata", formData)
    // const nom = formData.get("nom")

    const user = {
        nom: formData.get("nom"),
        prenom: formData.get("prenom"),
        pseudo: formData.get("pseudo"),
        email: formData.get("email"),
        password: formData.get("password")
    }
    console.log(user)
    await addUser(user)
    await displayUsers()

})

// document.getElementById('userForm').addEventListener('submit', async function (e) {
//     e.preventDefault();
// 
//     const nom = document.getElementById('nom').value;
//     const prenom = document.getElementById('prenom').value;
//     const pseudo = document.getElementById('pseudo').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;



//     // Réinitialiser le formulaire
//     document.getElementById('userForm').reset();
//     await displayUsers()
// });