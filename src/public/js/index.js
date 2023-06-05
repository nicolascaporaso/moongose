//FRONT
const socket = io();

socket.on("deleted", (deleted) => {

})

socket.on("createProductOk", (data) => {
    console.log(data);
    const cardContainer = document.getElementById('card-container');
    var newCard = document.createElement('div');
    newCard.id = data.id;
    newCard.style.display = 'inline-block';
    newCard.style.margin = '10px';
    newCard.style.border = '5px solid black';

    newCard.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.description}</p>
    <p>Precio: ${data.price}</p>
    <p>code: ${data.code}</p>
    <p>Stock: ${data.stock}</p>
    <p>status: ${data.status}</p>
    <img src= ${data.thumbnails} alt="product image" width="200" height="200">
    `;
    cardContainer.appendChild(newCard);
});

socket.on("createProductFail", (error) => {
    alert(error);
});


const formulario = document.getElementById("formSocket");
formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const status = document.getElementById("status").value;
    const data = {
        title, description, code, price, stock, status
    }

    socket.emit("createProduct", data);

})