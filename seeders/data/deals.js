const menuItemsSeeders = require('./menu-items'); 

module.exports = [
  {
    title: "Appetizer Combo",
    isActive:true,
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[0], "quantity": 1, "id": 1 },
      { ...menuItemsSeeders[1], "quantity": 3, "id": 2 },
      { ...menuItemsSeeders[2], "quantity": 2, "id": 3 }
    ]),
    price: 19,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Family Feast",
    isActive:true,
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[8], "quantity": 1, "id": 8 },
      { ...menuItemsSeeders[9], "quantity": 3 , "id": 9},
      { ...menuItemsSeeders[13], "quantity": 2 , "id": 13}
    ]),
    price: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Single Combo",
    isActive:true,
    menuItems: JSON.stringify([
      { ...menuItemsSeeders[2], "quantity": 1 , "id": 2},
      { ...menuItemsSeeders[7], "quantity": 3 , "id": 7},
      { ...menuItemsSeeders[14], "quantity": 2 , "id": 14},
      { ...menuItemsSeeders[16], "quantity": 2 , "id": 16}
    ]),
    price: 32,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
      title: "BBQ Delight",
      isActive:true,
      menuItems: JSON.stringify([
        { ...menuItemsSeeders[9], "quantity": 1 , "id": 9},
        { ...menuItemsSeeders[10], "quantity": 3 , "id": 10},
        { ...menuItemsSeeders[11], "quantity": 2 , "id": 11},
        { ...menuItemsSeeders[19], "quantity": 2 , "id": 19}
      ]),
      price: 32,
      createdAt: new Date(),
      updatedAt: new Date(),
  },
  {
      title: "Italian Combo",
      isActive:true,
      menuItems: JSON.stringify([
        { ...menuItemsSeeders[2], "quantity": 1 , "id": 2},
        { ...menuItemsSeeders[8], "quantity": 1 , "id": 8},
        { ...menuItemsSeeders[7], "quantity": 3 , "id": 7},
      ]),
      price: 32,
      createdAt: new Date(),
      updatedAt: new Date(),
  },
  {
      title: "Doubles Bravado",
      isActive:true,
      menuItems: JSON.stringify([
        { ...menuItemsSeeders[3], "quantity": 1 , "id": 3},
        { ...menuItemsSeeders[6], "quantity": 1 , "id": 6},
        { ...menuItemsSeeders[8], "quantity": 3 , "id": 8},
        { ...menuItemsSeeders[10], "quantity": 3 , "id": 10},
        { ...menuItemsSeeders[15], "quantity": 3 , "id": 15},
        { ...menuItemsSeeders[16], "quantity": 3 , "id": 16},
      ]),
      price: 32,
      createdAt: new Date(),
      updatedAt: new Date(),
  },
  {
      title: "Youngs Meal",
      isActive:true,
      menuItems: JSON.stringify([
        { ...menuItemsSeeders[2], "quantity": 1 , "id": 2},
        { ...menuItemsSeeders[7], "quantity": 1 , "id": 7},
        { ...menuItemsSeeders[15], "quantity": 3 , "id": 15},
        { ...menuItemsSeeders[16], "quantity": 3 , "id": 16},
      ]),
      price: 32,
      createdAt: new Date(),
      updatedAt: new Date(),
  },
  {
      title: "Cold appetite",
      isActive:true,
      menuItems: JSON.stringify([
        { ...menuItemsSeeders[6], "quantity": 1 , "id": 6},
        { ...menuItemsSeeders[15], "quantity": 3 , "id": 15},
        { ...menuItemsSeeders[16], "quantity": 3 , "id": 16},
      ]),
      price: 32,
      createdAt: new Date(),
      updatedAt: new Date(),
  },
]