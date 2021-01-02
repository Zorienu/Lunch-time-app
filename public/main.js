let fetchedUser = JSON.parse(localStorage.getItem('user')) || null
let mealsState = []

const stringToHTML = (s) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(s, 'text/html')
    return doc.body.firstChild
}

const createMealObject = (m) => {
    const quantity = parseInt(document.getElementById(`quantity-${m.name}`).innerText)
    if (!quantity) return
    const mealObject = {
        meal: m.name,
        quantity
    }
    return mealObject
}

const renderPriceList = (meal) => {
    const liMeal = document.getElementById(`li-${meal.name}`)
    const mealQuantity = parseInt(document.getElementById(`quantity-${meal.name}`).innerText)
    const element = stringToHTML(`
        <li id="li-${meal.name}" class="pricelist__ul-li">
            <p>(${mealQuantity}) ${meal.name}</p>
            <div></div>
            <p>$${meal.price * mealQuantity}</p>
        </li>`)
    
    if (!liMeal) { 
        const priceList = document.getElementById('pricelist')
        priceList.appendChild(element)
    } else if (mealQuantity != 0) {
        liMeal.innerHTML = element.innerHTML // if the element is already in the list, replace the inner html
    } else {
        liMeal.remove()
    }
}

const addEventsCards = (meal) => {
    const plusButton = document.getElementById(`plus-${meal.name}`)
    plusButton.addEventListener('click', () => {
        const quantity = document.getElementById(`quantity-${meal.name}`)
        quantity.innerText = parseInt(quantity.innerText) + 1
        renderPriceList(meal)

        // update total price
        const totalPrice = document.getElementById('total-price')
        totalPrice.innerText = parseInt(totalPrice.innerText) + meal.price
    })

    const minusButton = document.getElementById(`minus-${meal.name}`)
    minusButton.addEventListener('click', () => {
        const quantity = document.getElementById(`quantity-${meal.name}`)
        if (quantity.innerText != 0) quantity.innerText = parseInt(quantity.innerText) - 1
        else return
        renderPriceList(meal)

        // update total price
        const totalPrice = document.getElementById('total-price')
        totalPrice.innerText = parseInt(totalPrice.innerText) - meal.price
    })
}

const renderCard = (meal) => {
    const element = stringToHTML(`
        <div class="meal-card">
            <h3 class="text-center">${meal.name}</h3>
            <img src="${meal.img_link}" alt="${meal.name}">
            <div class="quantity-control">
                <a href="#" class="button-quantity" id="minus-${meal.name}"><i class="fas fa-minus"></i></a>
                <p id="quantity-${meal.name}">0</p>
                <a href="#" class="button-quantity" id="plus-${meal.name}"><i class="fas fa-plus"></i></a>
                </button>
            </div>
            <p class="text-center prices-card" id="price-${meal.name}">$${meal.price}</p>
        </div>`)
    
    return element
}

const initializeMealsCreation = () => {
    fetch('https://lunch-time.zorienu.vercel.app/api/meals')
        .then(x => x.json())
        .then(meals => {
            mealsState = meals
            const cards = document.getElementById('cards')

            const mealCardTemplates = meals.map(renderCard)
            mealCardTemplates.forEach(element => cards.appendChild(element))
            meals.map(addEventsCards)
        })
}

const initializeOrderCreation = () => {
    const submitOrderForm = document.getElementById('form-order')
    submitOrderForm.onsubmit = (e) => {
        e.preventDefault()
        const orderList = mealsState.map(meal => createMealObject(meal))
            .filter(order => order !== undefined)

        console.log(orderList)
        const orderObject = {
                user_email: fetchedUser.email,    
                user_address: fetchedUser.address,
                user_phone: fetchedUser.phone,
                order: orderList
            }

        fetch('https://lunch-time.zorienu.vercel.app/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('token')
            },
            body: JSON.stringify(orderObject) 
        })
        .then(res => res.json())
        .then(console.log)
    }
}

const renderLogin = () => {
    const app = document.getElementById('app')
    const loginTemplate = document.getElementById('login-template')
    app.innerHTML = loginTemplate.innerHTML

    const loginForm = document.getElementById('login-form')
    loginForm.onsubmit = (e) => {
        e.preventDefault()
        const email = document.getElementById('login-email').value
        const password = document.getElementById('login-password').value
        
        fetch('https://lunch-time.zorienu.vercel.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) 
        })
        .then(res => res.json())
        .then(res => {
            if (!res.token) return console.log(res.message)
            localStorage.setItem('token', res.token)
            return res.token
        })
        .then(token => {
            return fetch('https://lunch-time.zorienu.vercel.app/api/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token
                }
            })
        })
        .then(res => res.json())
        .then(user => {
            fetchedUser = user
            localStorage.setItem('user', JSON.stringify(user))
            renderApp()
        })
    }
}

const setLogoutbutton = () => {
    const button = document.getElementById('logout-btn')
    button.addEventListener('click', () => {
        localStorage.removeItem('token')
        renderApp()
    })
}

const initializeNavbar = () => {
    setLogoutbutton()
    const navBarMessage = document.getElementById('nav-bar-msg')
    navBarMessage.innerText = `You're logged as ${fetchedUser.email}`
}
const renderApp = () => {
    token = localStorage.getItem('token')
    if (!token) {
        return renderLogin()
    }

    // replace div app with user-template HTML
    document.getElementById('app').innerHTML = document.getElementById('user-template').innerHTML
    initializeMealsCreation()
    initializeOrderCreation()
    initializeNavbar()
}
window.onload = () => {
    renderApp()
}