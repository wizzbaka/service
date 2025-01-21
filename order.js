// order.js

// Fonction pour obtenir le numéro de la table à partir de l'URL
function getTableNumberFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('table');
}

// Charger le menu à partir du localStorage ou utiliser le menu par défaut
const menu = JSON.parse(localStorage.getItem('menu')) || {
    "Glaces": ["Glace Vanille", "Glace Chocolat", "Glace Fraise"],
    "Gaufres": ["Gaufre avec une boule de glace", "Gaufre avec deux boules de glace", "Gaufre au chocolat", "Gaufre au miel"],
    "Crêpes": ["Crêpe Sucrée", "Crêpe Salée"],
    "Cafés": ["Café Expresso", "Café Latte", "Café Cappuccino"]
};

let currentOrders = {};
let tableStatuses = JSON.parse(localStorage.getItem('tableStatuses')) || {};
let orders = JSON.parse(localStorage.getItem('orders')) || {};

document.addEventListener('DOMContentLoaded', function() {
    const tableNumber = getTableNumberFromURL();
    if (tableNumber) {
        document.getElementById('tableNumber').value = tableNumber;
        document.getElementById('tableNumberDisplay').textContent = tableNumber;
        updateTableColor(tableNumber);
    }

    const categoriesGrid = document.getElementById('categoriesGrid');
    const productsGrid = document.getElementById('productsGrid');

    // Générer les catégories
    Object.keys(menu).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.textContent = category;
        categoryDiv.addEventListener('click', function() {
            showProducts(category);
        });
        categoriesGrid.appendChild(categoryDiv);
    });

    // Fonction pour afficher les produits
    function showProducts(category) {
        productsGrid.innerHTML = ''; // Vider les produits existants
        menu[category].forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.textContent = product;
            productDiv.addEventListener('click', function() {
                addOrder(tableNumber, product);
                // Retour automatique aux catégories
                productsGrid.style.display = 'none';
                categoriesGrid.style.display = 'grid';
            });
            productsGrid.appendChild(productDiv);
        });
        categoriesGrid.style.display = 'none';
        productsGrid.style.display = 'grid';
    }

    // Ajouter une commande en cours sans répétition
    function addOrder(tableNumber, product) {
        if (!currentOrders[tableNumber]) {
            currentOrders[tableNumber] = [];
        }

        const existingOrder = currentOrders[tableNumber].find(order => order.product === product);

        if (existingOrder) {
            existingOrder.quantity += 1;
        } else {
            currentOrders[tableNumber].push({
                product,
                quantity: 1,
                options: ''
            });
        }

        updateCurrentOrdersList();
    }

    // Mettre à jour la liste des commandes en cours
    function updateCurrentOrdersList() {
        const currentOrdersList = document.getElementById('currentOrders');
        currentOrdersList.innerHTML = '';

        Object.keys(currentOrders).forEach(table => {
            const tableOrders = currentOrders[table];
            const tableHeader = document.createElement('li');
            tableHeader.textContent = `Table ${table}:`;
            currentOrdersList.appendChild(tableHeader);

            tableOrders.forEach((order, index) => {
                const orderItem = document.createElement('li');
                orderItem.textContent = `${order.quantity} x ${order.product} ${order.options ? ' - ' + order.options : ''}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.addEventListener('click', function() {
                    tableOrders.splice(index, 1);
                    if (tableOrders.length === 0) {
                        delete currentOrders[table];
                    }
                    updateCurrentOrdersList();
                });

                orderItem.appendChild(deleteButton);
                currentOrdersList.appendChild(orderItem);
            });
        });
    }

    // Bouton pour envoyer les commandes à la cuisine
    document.getElementById('sendToKitchenButton').addEventListener('click', function() {
        const ordersList = document.getElementById('orders');

        Object.keys(currentOrders).forEach(table => {
            const tableOrders = currentOrders[table];
            orders[table] = tableOrders;

            tableOrders.forEach(order => {
                const orderItem = document.createElement('li');
                orderItem.textContent = `Table ${table}: ${order.quantity} x ${order.product} ${order.options ? ' - ' + order.options : ''}`;
                ordersList.appendChild(orderItem);
            });

            tableStatuses[table] = "servis non payer";
            saveTableStatuses();
        });

        localStorage.setItem('orders', JSON.stringify(orders));
        currentOrders = {};
        updateCurrentOrdersList();
        alert('Commandes envoyées à la cuisine !');
    });

    // Bouton de configuration
    document.getElementById('configButton').addEventListener('click', function() {
        window.location.href = 'admin.html';
    });

    // Bouton de retour
    document.getElementById('returnButton').addEventListener('click', function() {
        if (productsGrid.style.display === 'grid') {
            productsGrid.style.display = 'none';
            categoriesGrid.style.display = 'grid';
        } else {
            window.location.href = 'index.html';
        }
    });
});

// Mettre à jour la couleur des tables selon le statut
function updateTableColor(tableNumber) {
    const tableDivs = document.getElementsByClassName('table');
    Array.from(tableDivs).forEach(div => {
        if (div.textContent.includes(`Table ${tableNumber}`) && tableStatuses[tableNumber] === "servis non payer") {
            div.style.backgroundColor = 'red';
        } else {
            div.style.backgroundColor = '#007BFF';
        }
    });
}

// Sauvegarder les statuts des tables dans le localStorage
function saveTableStatuses() {
    localStorage.setItem('tableStatuses', JSON.stringify(tableStatuses));
}
