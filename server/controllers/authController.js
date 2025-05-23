const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Temporary in-memory storage (replace with DB in production)
let users = [];

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      message: 'Login successful',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.logout = (req, res) => {
    // Note: Since JWT is stateless, we can't invalidate the token server-side
    // This is just for API consistency
    res.json({ message: 'Logout successful' });
  };

exports.getMe = (req, res) => {
  res.json({ user: req.user });
};