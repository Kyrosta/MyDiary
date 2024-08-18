import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Load data from JSON file
function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], entries: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Save data to JSON file
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const data = loadData();

    const user = data.users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user.username;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const data = loadData();

    if (data.users.find(u => u.username === username)) {
        res.json({ success: false, message: 'Username already exists' });
        return;
    }

    data.users.push({ username, password });
    saveData(data);
    res.json({ success: true });
});

// Write entry endpoint
app.post('/write-entry', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { content } = req.body;
    const data = loadData();

    data.entries.push({ username: req.session.user, content, timestamp: new Date() });
    saveData(data);

    res.json({ success: true });
});

// Logout endpoint
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/index.html');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
