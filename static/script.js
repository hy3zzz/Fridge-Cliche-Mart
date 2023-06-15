window.onload = function() {
  const xhr = new XMLHttpRequest();
  const url = "/get-cart";

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          if (xhr.status == 200) {
              const cart = JSON.parse(xhr.responseText);
              localStorage.setItem('cart', JSON.stringify(cart));  // store cart data in Local Storage
              showCart(cart);
          } else {
              console.log("Error getting cart: " + xhr.status);
          }
      }
  };
  xhr.send();
};

function addToCart(itemName, itemImage, itemDetail) {
  const xhr = new XMLHttpRequest();
  const url = "/add-to-cart";
  const params = `item_name=${itemName}&item_image=${itemImage}&item_detail=${itemDetail}`;

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          if (xhr.status == 200) {
              const cart = JSON.parse(xhr.responseText);
              localStorage.setItem('cart', JSON.stringify(cart));  // update the cart data in Local Storage
              showCart(cart);
          } else {
              console.log("Error adding item to cart: " + xhr.status);
          }
      }
  };
  xhr.send(params);
}

function showCart(cart) {
  const cartItemsDiv = document.getElementById("cart-items");
  let cartItemsHTML = "";

  for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      cartItemsHTML += `
          <div class="cart-item">
              <div class="cart-item-details">
                  <p class="cart-item-name">${i+1} ${item.name}</p>
              </div>
              <p class="cart-item-remove" onclick="removeCartItem('${item.name}')">x</p>
          </div>
          <p class="cart-item-detail">${item.detail}</p>
      `;
  }

  if (cart.length === 0) {
      cartItemsHTML = "<p class = 'cart-empty-message'>Your cart is empty.</p>";
  }

  cartItemsDiv.innerHTML = cartItemsHTML;

  // Show the cart overlay
  const cartOverlay = document.getElementById("cart-overlay");
  cartOverlay.classList.add("cart-overlay-open");

  // Hide the overlay background
  const overlayBackground = document.getElementById("overlay-background");
  overlayBackground.style.display = "block";
}

  
  function removeCartItem(itemName) {
    const xhr = new XMLHttpRequest();
    const url = "/remove-from-cart";
    const params = `item_name=${itemName}`;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          const cart = JSON.parse(xhr.responseText);
          console.log(cart);
          showCart(cart);
        } else {
          console.log("Error removing item from cart: " + xhr.status);
        }
      }
    };
    xhr.send(params);
  }

function callShowCart() {
    const xhr = new XMLHttpRequest();
    const url = "/get-cart"; // 장바구니 상태를 반환하는 엔드포인트

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const cart = JSON.parse(xhr.responseText);
                showCart(cart);
            } else {
                console.log("Error getting cart: " + xhr.status);
            }
        }
    };
    xhr.send();
}


    
function hideCart() {
    const cartOverlay = document.getElementById("cart-overlay");
    cartOverlay.classList.remove("cart-overlay-open");

    // Hide the overlay background
    const overlayBackground = document.getElementById("overlay-background");
    overlayBackground.style.display = "none";
}

document.addEventListener("click", function (event) {
const cartOverlay = document.getElementById("cart-overlay");
const overlayBackground = document.getElementById("overlay-background");

if (
    !cartOverlay.contains(event.target) &&
    !overlayBackground.contains(event.target) &&
    cartOverlay.classList.contains("cart-overlay-open")
) {
    hideCart();
}
});

const overlayBackground = document.getElementById("overlay-background");
overlayBackground.addEventListener("click", hideCart);
const closecartBtn = document.getElementById("close-cart-btn");
closecartBtn.addEventListener("click", hideCart)

let currentDate = new Date();
let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
let timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

let dateString = currentDate.toLocaleDateString('en-US', dateOptions);
let timeString = currentDate.toLocaleTimeString('en-US', timeOptions);

document.getElementById('date_time').innerText = `${dateString}, ${timeString}`;

