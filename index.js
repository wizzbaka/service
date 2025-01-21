// index.js
document.addEventListener('DOMContentLoaded', function() {
  const tablesGrid = document.getElementById('tablesGrid');
  const tableStatuses = JSON.parse(localStorage.getItem('tableStatuses')) || {};
  const orders = JSON.parse(localStorage.getItem('orders')) || {};

  // Générer les tables
  for (let i = 1; i <= 22; i++) {
      const tableDiv = document.createElement('div');
      tableDiv.className = 'table';
      tableDiv.textContent = `Table ${i}`;
      tableDiv.addEventListener('click', function() {
          if (tableStatuses[i] === "servis non payer") {
              showTableOrders(i);
          } else {
              window.location.href = `order.html?table=${i}`;
          }
      });
      if (tableStatuses[i] === "servis non payer") {
          tableDiv.style.backgroundColor = 'red';
      }
      tablesGrid.appendChild(tableDiv);
  }
});
  // Bouton de configuration
  document.getElementById('configButton').addEventListener('click', function() {
    window.location.href = 'admin.html';
});

function showTableOrders(tableNumber) {
  const orders = JSON.parse(localStorage.getItem('orders')) || {};
  const tableOrders = orders[tableNumber] || [];
  const orderDetails = document.getElementById('orderDetails');
  const orderTableNumber = document.getElementById('orderTableNumber');
  const orderList = document.getElementById('orderList');
  const clearTableButton = document.getElementById('clearTableButton');

  orderTableNumber.textContent = tableNumber;
  orderList.innerHTML = '';

  tableOrders.forEach(order => {
      const orderItem = document.createElement('li');
      orderItem.textContent = `${order.quantity} x ${order.product}`;
      orderList.appendChild(orderItem);
  });


  orderDetails.style.display = 'block';

  // Gérer le bouton "Vider la Table"
  clearTableButton.addEventListener('click', function() {
      delete orders[tableNumber];
      localStorage.setItem('orders', JSON.stringify(orders));

      const tableStatuses = JSON.parse(localStorage.getItem('tableStatuses')) || {};
      delete tableStatuses[tableNumber];
      localStorage.setItem('tableStatuses', JSON.stringify(tableStatuses));

      document.getElementById('orderDetails').style.display = 'none';
      const tableDivs = document.getElementsByClassName('table');
      Array.from(tableDivs).forEach(div => {
          if (div.textContent.includes(`Table ${tableNumber}`)) {
              div.style.backgroundColor = '#007BFF';
          }
      });
  });
}
