module.exports =  [
    {"input": "List all deals.", "query": "SELECT * FROM deals;"},

    {"input": "Find the total number of deals.", "query": "SELECT COUNT(*) FROM deals;"},
    {"input": "Get items of deals where id 1.", "query": "SELECT items FROM deals WHERE id = 1;"},
    {"input": "List all active recipes.", "query": "SELECT * FROM recpies WHERE isActive = true;"},
    {"input": "Return all recipes having in budget of 20$.", "query": "SELECT * FROM recpies WHERE price <= 20;"}, 
    {
    "input": "Find deals with prices greater than 50$.",
    "query": "SELECT * FROM deals WHERE price > 50;",
  },
  {
    "input": "Retrieve average price of all deals.",
    "query": "SELECT AVG(price) AS average_price FROM deals;",
  },
  {
    "input": "Retrieve deals ordered by price in ascending order.",
    "query": "SELECT * FROM deals ORDER BY price ASC;",
  },
  {
    "input": "Get details of deals with specific items.",
    "query": "SELECT * FROM deals WHERE items LIKE '%specificItem%';",
  },
  {
    "input": "Find deals with prices between 30$ and 50$.",
    "query": "SELECT * FROM deals WHERE price BETWEEN 30 AND 50;",
  },
  {
    "input": "Retrieve deals created in the last 7 days.",
    "query": "SELECT * FROM deals WHERE createdAt >= NOW() - INTERVAL 7 DAY;",
  },
  {
    "input": "Retrieve deals with specific items and price range.",
    "query": "SELECT * FROM deals WHERE items LIKE '%specificItem%' AND price BETWEEN 30 AND 50;",
  },
  {
    "input": "Join deals and recipes to get combined information.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId;",
  },
  {
    "input": "Join orders, users, and order details for comprehensive data.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id JOIN order_details ON orders.id = order_details.orderId;",
  },
  {
    "input": "Explore menu items, dish categories, and recipes together.",
    "query": "SELECT * FROM menu_items JOIN dish_categories ON menu_items.dishCategoryId = dish_categories.id JOIN recipes ON menu_items.id = recipes.dishId;",
  },
  
  {
    "input": "Get details of active recipes with video tutorials.",
    "query": "SELECT * FROM recipes WHERE isActive = true AND videoUrl IS NOT NULL;",
  },
  {
    "input": "Retrieve recipes with steps provided in JSON format.",
    "query": "SELECT * FROM recipes WHERE steps IS NOT NULL;",
  },
  {
    "input": "Find recipes with prices between 15$ and 25$.",
    "query": "SELECT * FROM recipes WHERE price BETWEEN 15 AND 25;",
  },
  {
    "input": "List menu items from a specific dish category.",
    "query": "SELECT * FROM menu_items WHERE dishCategoryId = 1;",
  },
  {
    "input": "Retrieve menu items with serving size greater than 2.",
    "query": "SELECT * FROM menu_items WHERE servingSize > 2;",
  },
  {
    "input": "Find menu items with dish category name 'Main Course'.",
    "query": "SELECT * FROM menu_items WHERE dishCategoryName = 'Main Course';",
  },
   {
    "input": "List pending orders with a total amount above 50$.",
    "query": "SELECT * FROM orders WHERE status = 'pending' AND amount > 50;",
  },
  {
    "input": "Retrieve details of completed orders by a specific user.",
    "query": "SELECT * FROM orders WHERE status = 'completed' AND userId = 1;",
  },
  {
    "input": "Find offline orders placed within the last 30 days.",
    "query": "SELECT * FROM orders WHERE type = 'offline' AND createdAt >= NOW() - INTERVAL 30 DAY;",
  },
   {
    "input": "List order details for a specific order ID.",
    "query": "SELECT * FROM order_details WHERE orderId = 1;",
  },
  {
    "input": "Retrieve order details with prices greater than 10$.",
    "query": "SELECT * FROM order_details WHERE price > 10;",
  },
  {
    "input": "Find order details for completed orders.",
    "query": "SELECT * FROM order_details JOIN orders ON order_details.orderId = orders.id WHERE orders.status = 'completed';",
  },
   {
    "input": "List vendors with a rating above 4.",
    "query": "SELECT * FROM vendors WHERE rating > 4;",
  },
  {
    "input": "Retrieve vendor details with a specific payment method.",
    "query": "SELECT * FROM vendors WHERE paymentMethod = 'Credit Card';",
  },
  {
    "input": "Find vendors with payment terms 'Net 30'.",
    "query": "SELECT * FROM vendors WHERE paymentTerms = 'Net 30';",
  },
  {
    "input": "List users with a specific role title.",
    "query": "SELECT * FROM users WHERE roleTitle = 'Customer';",
  },
  {
    "input": "Retrieve user details by email address.",
    "query": "SELECT * FROM users WHERE email = 'user@example.com';",
  },
  {
    "input": "Find users with a verification code for account activation.",
    "query": "SELECT * FROM users WHERE verificationCode IS NOT NULL;",
  },
   {
    "input": "List credit transactions with a specific description.",
    "query": "SELECT * FROM transactions WHERE type = 'credit' AND description = 'Purchase';",
  },
  {
    "input": "Retrieve debit transactions with a title containing 'Expense'.",
    "query": "SELECT * FROM transactions WHERE type = 'debit' AND title LIKE '%Expense%';",
  },
  {
    "input": "Find all transactions with a description provided.",
    "query": "SELECT * FROM transactions WHERE description IS NOT NULL;",
  },
   {
    "input": "List roles with specific scopes.",
    "query": "SELECT * FROM roles WHERE scopes LIKE '%admin%';",
  },
  {
    "input": "Retrieve role details with a title of 'Manager'.",
    "query": "SELECT * FROM roles WHERE title = 'Manager';",
  },
  {
    "input": "Find roles with no specified scopes.",
    "query": "SELECT * FROM roles WHERE scopes IS NULL OR scopes = '';",
  },
  
  {
    "input": "List items with a specific brand.",
    "query": "SELECT * FROM items WHERE itemBrand = 'BrandName';",
  },
  {
    "input": "Retrieve items with an expiry date within the next 30 days.",
    "query": "SELECT * FROM items WHERE expiryDate IS NOT NULL AND expiryDate >= NOW() AND expiryDate <= NOW() + INTERVAL 30 DAY;",
  },
  {
    "input": "Find items with a specific unit, e.g., 'kg'.",
    "query": "SELECT * FROM items WHERE unit = 'kg';",
  },
    {
    "input": "List inventory types with a specific title.",
    "query": "SELECT * FROM inventory_types WHERE title = 'TypeTitle';",
  },
  {
    "input": "Retrieve details of all inventory types.",
    "query": "SELECT * FROM inventory_types;",
  },
  {
    "input": "Find inventory types with no specified title.",
    "query": "SELECT * FROM inventory_types WHERE title IS NULL OR title = '';",
  },
  {
    "input": "List item-dish associations with a specific inventory type.",
    "query": "SELECT * FROM item_dish_associations WHERE inventoryType = 'ingredient';",
  },
  {
    "input": "Retrieve associations for active dishes with inventory tools.",
    "query": "SELECT * FROM item_dish_associations WHERE isActive = true AND inventoryType = 'tool';",
  },
  {
    "input": "Find associations for dishes with specific inventory type and ID.",
    "query": "SELECT * FROM item_dish_associations WHERE inventoryType = 'ingredient' AND inventoryId = 1;",
  },
  {
    "input": "List deals with associated recipes.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId;",
  },
  {
    "input": "Retrieve orders with user details.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id;",
  },
  {
    "input": "Explore menu items with dish categories.",
    "query": "SELECT * FROM menu_items JOIN dish_categories ON menu_items.dishCategoryId = dish_categories.id;",
  },

  {
    "input": "Join orders, users, and order details for comprehensive data.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id JOIN order_details ON orders.id = order_details.orderId;",
  },
  {
    "input": "Explore menu items, dish categories, and recipes together.",
    "query": "SELECT * FROM menu_items JOIN dish_categories ON menu_items.dishCategoryId = dish_categories.id JOIN recipes ON menu_items.id = recipes.dishId;",
  },
  {
    "input": "Combine deals, recipes, and order details for insights.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId JOIN order_details ON deals.id = order_details.dishId;",
  },

  {
    "input": "Join deals, recipes, and item associations for detailed information.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId JOIN item_dish_associations ON deals.id = item_dish_associations.dishId;",
  },
  {
    "input": "Retrieve orders with associated users, items, and recipes.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id JOIN order_details ON orders.id = order_details.orderId JOIN menu_items ON order_details.dishId = menu_items.id JOIN recipes ON menu_items.id = recipes.dishId;",
  },
  {
    "input": "Join users, roles, and transactions for user activity.",
    "query": "SELECT * FROM users JOIN roles ON users.roleId = roles.id LEFT JOIN transactions ON users.id = transactions.userId;",
  },

  {
    "input": "Find users who referred other users.",
    "query": "SELECT u1.*, u2.fullName AS referredBy FROM users u1 LEFT JOIN users u2 ON u1.referredBy = u2.id;",
  },

  {
    "input": "Combine deals, recipes, and item associations with specific conditions.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId JOIN item_dish_associations ON deals.id = item_dish_associations.dishId WHERE deals.price > 30 AND item_dish_associations.isActive = true;",
  },
  {
    "input": "Join orders and users with specific status and user role.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id WHERE orders.status = 'completed' AND users.roleTitle = 'Customer';",
  },
   {
    "input": "Get user transactions with associated roles.",
    "query": "SELECT * FROM users JOIN roles ON users.roleId = roles.id LEFT JOIN transactions ON users.id = transactions.userId WHERE transactions.type = 'debit';",
  },
  {
    "input": "Join users and roles with specific role titles.",
    "query": "SELECT * FROM users JOIN roles ON users.roleId = roles.id WHERE roles.title IN ('Admin', 'Manager');",
  },
  {
    "input": "Retrieve completed orders with associated user details.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id WHERE orders.status = 'completed';",
  },
  {
    "input": "Join orders with users having a specific email domain.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id WHERE users.email LIKE '%@example.com%';",
  },
  {
    "input": "List items with their associated inventory types.",
    "query": "SELECT * FROM items JOIN inventory_types ON items.inventoryTypeId = inventory_types.id;",
  },
  {
    "input": "Join item-dish associations and items for specific dish categories.",
    "query": "SELECT * FROM item_dish_associations JOIN items ON item_dish_associations.inventoryId = items.id WHERE item_dish_associations.inventoryType = 'ingredient';",
  },

  {
    "input": "Explore deals, recipes, and menu items together.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId JOIN menu_items ON deals.id = menu_items.id;",
  },
  {
    "input": "Join order details, items, and transactions for a complete view.",
    "query": "SELECT * FROM order_details JOIN items ON order_details.dishId = items.id JOIN transactions ON order_details.recipeId = transactions.recipeId;",
  },

  {
    "input": "Combine orders, users, and transactions with specific transaction types.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id LEFT JOIN transactions ON users.id = transactions.userId AND transactions.type = 'credit';",
  },
  {
    "input": "Join recipes, menu items, and dish categories with specific conditions.",
    "query": "SELECT * FROM recipes JOIN menu_items ON recipes.dishId = menu_items.id JOIN dish_categories ON menu_items.dishCategoryId = dish_categories.id WHERE recipes.isActive = true;",
  },

  {
    "input": "Find users who referred other users with specific roles.",
    "query": "SELECT u1.*, u2.fullName AS referredBy FROM users u1 LEFT JOIN users u2 ON u1.referredBy = u2.id WHERE u2.roleTitle = 'VIP';",
  },
  {
    "input": "Self-JOIN to find users who share the same email domain.",
    "query": "SELECT u1.*, u2.fullName AS sharedDomainUser FROM users u1 JOIN users u2 ON SUBSTRING_INDEX(u1.email, '@', -1) = SUBSTRING_INDEX(u2.email, '@', -1) AND u1.id <> u2.id;",
  },
  {
    "input": "Explore deals, recipes, menu items, and dish categories together.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId JOIN menu_items ON deals.id = menu_items.id JOIN dish_categories ON menu_items.dishCategoryId = dish_categories.id;",
  },
  {
    "input": "Join orders, users, order details, and recipes for comprehensive data.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id JOIN order_details ON orders.id = order_details.orderId JOIN recipes ON order_details.recipeId = recipes.id;",
  },
  {
    "input": "Combine deals, recipes, and item-dish associations with specific conditions.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId JOIN item_dish_associations ON deals.id = item_dish_associations.dishId WHERE deals.price > 30 AND item_dish_associations.isActive = true;",
  },
  {
    "input": "Join orders, users, and transactions with specific transaction types.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id LEFT JOIN transactions ON users.id = transactions.userId AND transactions.type = 'credit';",
  },

  {
    "input": "Explore deals, recipes, menu items, and inventory types together.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId JOIN menu_items ON deals.id = menu_items.id JOIN inventory_types ON menu_items.inventoryTypeId = inventory_types.id;",
  },
  {
    "input": "Join orders, users, order details, and items for a comprehensive view.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id JOIN order_details ON orders.id = order_details.orderId JOIN items ON order_details.recipeId = items.id;",
  },

  {
    "input": "Combine deals, recipes, item-dish associations, and inventory types with specific criteria.",
    "query": "SELECT * FROM deals JOIN recipes ON deals.id = recipes.dishId JOIN item_dish_associations ON deals.id = item_dish_associations.dishId JOIN inventory_types ON item_dish_associations.inventoryTypeId = inventory_types.id WHERE deals.price > 30 AND item_dish_associations.isActive = true;",
  },
  {
    "input": "Join orders, users, transactions, and roles with specific conditions.",
    "query": "SELECT * FROM orders JOIN users ON orders.userId = users.id LEFT JOIN transactions ON users.id = transactions.userId AND transactions.type = 'credit' JOIN roles ON users.roleId = roles.id WHERE roles.title = 'Customer';",
  },
  {
    "input": "Explore users, transactions, and roles with self-JOIN for referral information.",
    "query": "SELECT u.*, t1.*, r.title AS referredByRole FROM users u LEFT JOIN transactions t1 ON u.id = t1.userId LEFT JOIN users u2 ON t1.referralUserId = u2.id LEFT JOIN transactions t2 ON u2.id = t2.userId LEFT JOIN roles r ON u2.roleId = r.id WHERE t2.type = 'referral';",
  },
  {
    "input": "Join orders, users, and roles with self-JOIN for related users.",
    "query": "SELECT o.*, u1.*, u2.fullName AS relatedUser FROM orders o JOIN users u1 ON o.userId = u1.id JOIN users u2 ON u1.roleId = u2.roleId WHERE u1.id <> u2.id;",
  },
]
