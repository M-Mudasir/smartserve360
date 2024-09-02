const menuItemsSeeders = require('./menu-items'); 

module.exports =[
  {
    customerName: "John Doe",
    contactInfo: "john@example.com",
    amount: 35.5,
    type: "dine-in",
    status: "pending",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[0], "quantity": 1, "id": 1 },
      { ...menuItemsSeeders[7], "quantity": 3, "id": 8 },
      { ...menuItemsSeeders[9], "quantity": 2, "id": 10 }
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    customerName: "Jane Smith",
    contactInfo: "jane@example.com",
    amount: 42.75,
    type: "dine-in",
    status: "pending",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[12], "quantity": 1, "id": 13 },
      { ...menuItemsSeeders[6], "quantity": 3, "id": 7 },
      { ...menuItemsSeeders[4], "quantity": 2, "id": 5 },
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    customerName: "Alice Johnson",
    contactInfo: "alice@example.com",
    amount: 28.99,
    type: "dine-in",
    status: "completed",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[4], "quantity": 1, "id": 5 },
      { ...menuItemsSeeders[8], "quantity": 3, "id": 9 },
      { ...menuItemsSeeders[15], "quantity": 2, "id": 16 }
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    customerName: "Hanna Johnson",
    contactInfo: "hanna@example.com",
    amount: 58.99,
    type: "dine-in",
    status: "completed",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[4], "quantity": 1, "id": 5 },
      { ...menuItemsSeeders[8], "quantity": 3, "id": 9 },
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    customerName: "Bob Smith",
    contactInfo: "bob@example.com",
    amount: 18.99,
    type: "dine-in",
    status: "completed",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[2], "quantity": 1, "id": 3 },
      { ...menuItemsSeeders[3], "quantity": 3, "id": 4 },
      { ...menuItemsSeeders[5], "quantity": 1, "id": 6 },
      { ...menuItemsSeeders[7], "quantity": 3, "id": 8 },
      { ...menuItemsSeeders[9], "quantity": 1, "id": 10 },
      { ...menuItemsSeeders[15], "quantity": 3, "id": 16 },
      { ...menuItemsSeeders[16], "quantity": 2, "id": 17 }
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    customerName: "Carol Williams",
    contactInfo: "carol@example.com",
    amount: 98.99,
    type: "dine-in",
    status: "completed",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[7], "quantity": 1, "id": 8 },
      { ...menuItemsSeeders[10], "quantity": 3, "id": 11 },
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    customerName: "David Brown",
    contactInfo: "david@example.com",
    amount: 28.99,
    type: "dine-in",
    status: "cancelled",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[4], "quantity": 1, "id": 5 },
      { ...menuItemsSeeders[8], "quantity": 3, "id": 9 },
      { ...menuItemsSeeders[15], "quantity": 2, "id": 16 }
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    customerName: "Eva Miller",
    contactInfo: "eva@example.com",
    amount: 68.99,
    type: "dine-in",
    status: "completed",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[14], "quantity": 2, "id": 15 },
      { ...menuItemsSeeders[15], "quantity": 3, "id": 16 },
      { ...menuItemsSeeders[16], "quantity": 2, "id": 17 },
      { ...menuItemsSeeders[17], "quantity": 3, "id": 18 },
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    customerName: "Frank Davis",
    contactInfo: "frank@example.com",
    amount: 18.99,
    type: "dine-in",
    status: "completed",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[15], "quantity": 1, "id": 16 },
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    customerName: "Grace Wilson",
    contactInfo: "grace@example.com",
    amount: 8.99,
    type: "dine-in",
    status: "completed",
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[10], "quantity": 1, "id": 11 },
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },

]