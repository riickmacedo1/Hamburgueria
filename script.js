const dateSpan = document.getElementById("data-span");
const menu = document.getElementById("menu");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const closeModalBtn = document.getElementById("close-modal-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-count");

let cart = [];

//abrir o modal do carrinho
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

//fechar o modal do carrinho
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal || event.target === closeModalBtn) {
    cartModal.style.display = "none";
  }
});

//verificar se estou clicando no botao de adicionar no carrinho
menu.addEventListener("click", (event) => {
  //verificando se estou clicando no botão ou no que tem dentro do btn,
  //colocando dentro da variável para poder usar
  let parentButton = event.target.closest(".add-to-card-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

//adicionando um item ao carrinho, lembrando que o carrinho é uma lista/array
function addToCart(name, price) {
  //verificando se o item que eu cliquei já está na lista, já tinha adicionado ou não
  let existingItem = cart.find((item) => item.name === name);

  //verificação, se tem na lista só vai aumentar + 1 na quantidade
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    //adicionando o item no carrinho
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//renderizando os itens no modal ao adicionar
function updateCartModal() {
  //zerando meu array, SEMPRE COMEÇA ZERADO!
  cartItemsContainer.innerHTML = "";
  //zerando meu total, SEMPRE COMEÇA ZERADO!
  let total = 0;

  cart.map((item) => {
    const cartElement = document.createElement("div");
    cartElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartElement.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-bold">${item.name}</p>
        <p class="font-bold">R$: ${item.price.toFixed(2)}</p>
        <p class="text-red-500 font-bold">Quantidade: ${item.quantity}</p>
      </div>

      
      <button class="remove-item" data-name="${item.name}">
        Remover item
      </button>
      
    </div>
    `;
    cartItemsContainer.appendChild(cartElement);

    //fazendo soma dos itens
    total += item.price * item.quantity;
  });

  //adicionando o texto na soma e escolhendo a moeda do pais
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  //mostrando a quantidade de produtos no footer
  cartCounter.innerHTML = cart.length;
}

//função de remover itens do carrinho
cartItemsContainer.addEventListener("click", (event) => {
  //procurando no botao se existe a class remove item
  if (event.target.classList.contains("remove-item")) {
    //aqui estou jogando o atributo data-name que coloquei no botao
    //na variavel name
    const name = event.target.getAttribute("data-name");
    removeItem(name);
  }
});

function removeItem(name) {
  const index = cart.findIndex((item) => item.name === name);

  //só retorna -1 quando ele não encontra na lista
  if (index !== -1) {
    const item = cart[index];

    // se a quantidade do item for maior que 1, remove 1 unidade
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

//FINALIZAR PEDIDO

//evento de monitorar o INPUT, caso o usuario digite algo, some o texto
//de precisar digitar endereço caso caia no if abaixo
addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", () => {
  const isOpen = openRestaurant();
  if (!isOpen) {
    Toastify({
      text: "O restaurante está fechado",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  //2 verificações se o carrinho tiver vazio ele barra
  if (cart.length === 0) {
    Toastify({
      text: "Adicione um item no carrinho",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }
  //se o endereço tiver vazio ele barra e remove o hidden que da o alert
  //do campo endereço vazio
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
  }

  const cartItems = cart
    .map((item) => {
      return `
        ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}
      `;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "5581994589991";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  cart = [];
  updateCartModal();
});

//FUNÇÃO DE CHECAR A HORA DE FUNCIONAMENTO
function openRestaurant() {
  //const pegando a hora e a data atual do dia
  const data = new Date();
  const hora = data.getHours();
  //se a hora for maior ou igual a 18 e menor que 22, retorna true
  return hora >= 18 && hora < 22;
}

const isOpen = openRestaurant();

if (isOpen) {
  //se tiver aberto remove o background red e add o verde
  dateSpan.classList.remove("bg-red-500");
  dateSpan.classList.add("bg-green-600");
} else {
  dateSpan.classList.remove("bg-green-600");
  dateSpan.classList.add("bg-red-500");
}
