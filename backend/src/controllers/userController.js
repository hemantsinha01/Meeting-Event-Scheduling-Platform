const getAllUsers = async (req, res) => {
    try {
      const db = req.app.locals.db;
      const usersCollection = db.collection("users");
  
      // Fetch only email addresses
      const users = await usersCollection.find({}, { projection: { email: 1, _id: 0 } }).toArray();
  
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  module.exports = { getAllUsers };
  