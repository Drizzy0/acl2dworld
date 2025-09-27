export const mockProducts = [
  { id: 1, name: "Toxic Black Fade", price: 50, stock: 100, image: "/images/black half.JPG" },
  { id: 2, name: "Toxic Air Fade", price: 50, stock: 75, image: "/images/black full.JPG" },
  { id: 3, name: "Toxic Air White", price: 59.99, stock: 50, image: "/images/superman_white.JPG" },
  { id: 4, name: "Toxic Air Brown", price: 49.99, stock: 80, image: "/images/brown.JPG" },
  { id: 5, name: "ACL Joggers Gray", price: 89.99, stock: 30, image: "/images/joggers_ash.JPG" },
];

export const mockOrders = [
  { id: 1, userEmail: "user1@example.com", total: 100, status: "Pending", date: "2025-09-20" },
  { id: 2, userEmail: "user2@example.com", total: 150, status: "Shipped", date: "2025-09-25" },
  { id: 3, userEmail: "user3@example.com", total: 200, status: "Delivered", date: "2025-09-26" },
  { id: 4, userEmail: "admin@example.com", total: 75, status: "Pending", date: "2025-09-26" },
];

export const mockUsers = [
  { id: 1, email: "admin@example.com", role: "Admin", joined: "2025-01-01" },
  { id: 2, email: "user1@example.com", role: "User", joined: "2025-09-01" },
  { id: 3, email: "user2@example.com", role: "User", joined: "2025-09-15" },
  { id: 4, email: "user3@example.com", role: "Admin", joined: "2025-09-20" },
];

export const mockStats = {
  totalUsers: 150,
  totalOrders: 320,
  totalRevenue: 15000,
  totalProducts: 50,
};