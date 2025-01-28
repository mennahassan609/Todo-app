const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const UserModel=require('./models/Users')
const Todo = require('./models/Todo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://menna:1234@cluster0.5blym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error:", err));

    const authenticateToken = (req, res, next) => {
        const token = req.header('Authorization')?.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ error: 'Access denied, no token provided' });
        }
    
        jwt.verify(token, 'your_secret_key', (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
    
            req.userId = decoded.userId;
            next();
        });
    };
    

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
    
        try {
            const user = await UserModel.findOne({ email: email });
    
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
    
            if (isPasswordValid) {
                const token = jwt.sign(
                    { userId: user._id, email: user.email },
                    'your_secret_key',
                    { expiresIn: '1h' }
                );
    
                res.status(200).json({ success: true, message: 'Login successful', token: token });
            } else {
                res.status(400).json({ success: false, message: 'Incorrect password' });
            }
        } catch (err) {
            console.error('Error during login:', err);
            res.status(500).json({ success: false, message: 'Error during login' });
        }
    });

    app.post('/signup', async (req, res) => {
        const { name, email, password,phone} = req.body;
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = new UserModel({
                name,
                email,
                password: hashedPassword,
                phone
            });
    
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully!' });
        } catch (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ error: 'Error registering user' });
        }
    });
    app.get('/getUser/me', authenticateToken, (req, res) => {
        UserModel.findById(req.userId)
            .then(user => res.json(user))
            .catch(err => res.status(400).json({ error: 'User not found' }));
    });
    
    app.get('/getUser/:id', authenticateToken, (req, res) => {
        const id = req.params.id;
    
        if (id !== req.userId) {
            return res.status(403).json({ message: 'You can only view your own details' });
        }
    
        UserModel.findById(id)
            .then(user => res.json(user))
            .catch(err => res.status(400).json({ error: err.message }));
    });
    
    app.put('/updateUser/:id', authenticateToken, (req, res) => {
        const id = req.params.id;
    
        if (id !== req.userId) {
            return res.status(403).json({ message: 'You can only update your own details' });
        }
    
        const { name, email, phone } = req.body;
        UserModel.findByIdAndUpdate(id, { name, email,phone }, { new: true })
            .then(user => res.json(user))
            .catch(err => res.status(400).json({ error: err.message }));
    });
    
    app.delete('/deleteUser/:id', authenticateToken, (req, res) => {
        const id = req.params.id;
    
        if (id !== req.userId) {
            return res.status(403).json({ message: 'You can only delete your own account' });
        }
    
        UserModel.findByIdAndDelete(id)
            .then(() => res.json({ message: 'User deleted successfully' }))
            .catch(err => res.status(400).json({ error: err.message }));
    });
    
      
    app.post("/createUser", (req, res) => {
        console.log("Received data:", req.body);
    
        UserModel.create(req.body)
            .then(user => {
                console.log("User created:", user); 
                res.json(user);
            })
            .catch(err => {
                console.error("Error saving user:", err);
                res.status(500).json({ error: err.message });
            });
    });

    app.post('/todo', authenticateToken, (req, res) => {
        const { title, description, dueDate, status } = req.body;
      
        const todo = new Todo({
          title,
          description,
          dueDate,
          status,
          userId: req.userId
        });
      
        todo.save()
          .then(todo => res.status(201).json(todo))
          .catch(err => res.status(400).json({ error: err.message }));
      });
      
      app.get('/todo', authenticateToken, (req, res) => {
        const { status, search } = req.query;
    
        let filter = { userId: req.userId };
    
        if (status) {
            filter.status = status;
        }
    
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
    
        Todo.find(filter)
            .then(todos => res.json(todos))
            .catch(err => res.status(400).json({ error: err.message }));
    });
    

    app.put('/todo/:id', authenticateToken, (req, res) => {
        const { title, description, status, dueDate } = req.body;
        const { id } = req.params;
    
        Todo.findByIdAndUpdate(id, { title, description, status, dueDate }, { new: true })
            .then(todo => res.json(todo))
            .catch(err => res.status(400).json({ error: err.message }));
    });
    
      
      app.delete('/todo/:id', authenticateToken, (req, res) => {
        const { id } = req.params;
      
        Todo.findByIdAndDelete(id)
          .then(() => res.json({ message: 'To-do deleted successfully' }))
          .catch(err => res.status(400).json({ error: err.message }));
      });
    
    
app.listen(3001,()=>{
    console.log("Server is Running")
})