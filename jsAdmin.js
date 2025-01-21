// admin.js

// Charger le menu à partir du localStorage ou utiliser le menu par défaut
let menu = JSON.parse(localStorage.getItem('menu')) || {
  "Glaces": ["Glace Vanille", "Glace Chocolat", "Glace Fraise"],
  "Gaufres": ["Gaufre avec une boule de glace", "Gaufre avec deux boules de glace", "Gaufre au chocolat", "Gaufre au miel"],
  "Crêpes": ["Crêpe Sucrée", "Crêpe Salée"],
  "Cafés": ["Café Expresso", "Café Latte", "Café Cappuccino"]
};

document.addEventListener('DOMContentLoaded', function() {
  const categorySelect = document.getElementById('categorySelect');
  const menuList = document.getElementById('menuList');

  // Initialiser le sélecteur de catégories et la liste du menu
  updateCategorySelect();
  updateMenuList();

  // Ajouter une nouvelle catégorie
  document.getElementById('addCategoryForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const categoryName = document.getElementById('categoryName').value.trim();
      if (categoryName && !menu[categoryName]) {
          menu[categoryName] = [];
          updateCategorySelect();
          updateMenuList();
          document.getElementById('addCategoryForm').reset();
          saveMenu();
      }
  });

  // Ajouter un nouveau produit
  document.getElementById('addProductForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const category = categorySelect.value;
      const productName = document.getElementById('productName').value.trim();
      if (category && productName) {
          menu[category].push(productName);
          updateMenuList();
          document.getElementById('addProductForm').reset();
          saveMenu();
      }
  });

  // Mettre à jour le sélecteur de catégories
  function updateCategorySelect() {
      categorySelect.innerHTML = '';
      Object.keys(menu).forEach(category => {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = category;
          categorySelect.appendChild(option);
      });
  }

  // Mettre à jour la liste du menu
  function updateMenuList() {
      menuList.innerHTML = '';
      Object.keys(menu).forEach(category => {
          const categoryItem = document.createElement('li');
          const categorySpan = document.createElement('span');
          categorySpan.textContent = category;
          const deleteCategoryBtn = document.createElement('button');
          deleteCategoryBtn.textContent = 'Supprimer Catégorie';
          deleteCategoryBtn.addEventListener('click', function() {
              delete menu[category];
              updateCategorySelect();
              updateMenuList();
              saveMenu();
          });
          categoryItem.appendChild(categorySpan);
          categoryItem.appendChild(deleteCategoryBtn);
          menuList.appendChild(categoryItem);

          menu[category].forEach(product => {
              const productItem = document.createElement('li');
              const productSpan = document.createElement('span');
              productSpan.textContent = ` - ${product}`;
              const deleteProductBtn = document.createElement('button');
              deleteProductBtn.textContent = 'Supprimer Produit';
              deleteProductBtn.addEventListener('click', function() {
                  const productIndex = menu[category].indexOf(product);
                  if (productIndex > -1) {
                      menu[category].splice(productIndex, 1);
                      updateMenuList();
                      saveMenu();
                  }
              });
              productItem.appendChild(productSpan);
              productItem.appendChild(deleteProductBtn);
              menuList.appendChild(productItem);
          });
      });
  }

  // Sauvegarder le menu dans le localStorage
  function saveMenu() {
      localStorage.setItem('menu', JSON.stringify(menu));
  }
  //button de retour
  document.getElementById('returnButton').addEventListener('click', function(){
    window.location.href = '../interface_serveur/order.html';
  } );;
});