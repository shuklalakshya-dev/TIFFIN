// Seed script to create demo orders for testing admin dashboard
const { MongoClient } = require('mongodb');

async function seedOrders() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB || 'tiffin';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    
    // Clear existing orders
    await ordersCollection.deleteMany({});
    console.log('Cleared existing orders');
    
    // Sample orders data
    const sampleOrders = [
      {
        customerInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          address: "123 Main St, City, State"
        },
        items: [
          {
            productId: "product1",
            name: "Chicken Biryani",
            price: 15.99,
            quantity: 2
          },
          {
            productId: "product2", 
            name: "Vegetable Curry",
            price: 12.99,
            quantity: 1
          }
        ],
        totalAmount: 44.97,
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        customerInfo: {
          name: "Jane Smith",
          email: "jane@example.com", 
          phone: "+1987654321",
          address: "456 Oak Ave, City, State"
        },
        items: [
          {
            productId: "product3",
            name: "Dal Makhani",
            price: 11.99,
            quantity: 1
          }
        ],
        totalAmount: 11.99,
        status: "confirmed",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        customerInfo: {
          name: "Mike Johnson",
          email: "mike@example.com",
          phone: "+1122334455", 
          address: "789 Pine St, City, State"
        },
        items: [
          {
            productId: "product4",
            name: "Tandoori Chicken",
            price: 18.99,
            quantity: 1
          },
          {
            productId: "product5",
            name: "Naan Bread",
            price: 3.99,
            quantity: 3
          }
        ],
        totalAmount: 30.96,
        status: "preparing",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        customerInfo: {
          name: "Sarah Wilson",
          email: "sarah@example.com",
          phone: "+1555666777",
          address: "321 Elm St, City, State"
        },
        items: [
          {
            productId: "product6",
            name: "Palak Paneer",
            price: 14.99,
            quantity: 1
          },
          {
            productId: "product7",
            name: "Basmati Rice",
            price: 4.99,
            quantity: 2
          }
        ],
        totalAmount: 24.97,
        status: "delivered",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        customerInfo: {
          name: "David Brown",
          email: "david@example.com",
          phone: "+1777888999",
          address: "654 Maple Dr, City, State"
        },
        items: [
          {
            productId: "product8",
            name: "Mutton Curry",
            price: 22.99,
            quantity: 1
          }
        ],
        totalAmount: 22.99,
        status: "pending",
        createdAt: new Date() // Current time
      }
    ];
    
    // Insert sample orders
    const result = await ordersCollection.insertMany(sampleOrders);
    console.log(`Inserted ${result.insertedCount} sample orders`);
    
    console.log('Orders seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding orders:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedOrders().catch(console.error);
