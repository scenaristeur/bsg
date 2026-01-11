console.log("script.js")

async function displayUsers() {
    const response = await fetch("/users")
    const users = await response.json()
    console.log(users)


    const tableBody = document.querySelector('#userTable tbody');

    for (user of users) {
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
            `;

        tableBody.appendChild(newRow);
    }

}


document.addEventListener("DOMContentLoaded", async () => {
    await displayUsers()
})


document.getElementById('userForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;



    // Réinitialiser le formulaire
    document.getElementById('userForm').reset();
    await displayUsers()
});