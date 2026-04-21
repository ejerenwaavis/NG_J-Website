require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const path      = require('path');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (public site + uploads)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/services',     require('./routes/services'));
app.use('/api/team',         require('./routes/team'));

// Admin panel routes
app.get('/admin', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/index.html'))
);
app.get('/admin/dashboard', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/dashboard.html'))
);
app.get('/service-enhancements', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/service-enhancements.html'))
);

// Catch-all → public site
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Port with fallback in case the chosen port is in use
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`🚚 NG&J Swift running on http://localhost:${PORT}`)
);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallback = parseInt(PORT) + 1;
    console.warn(`⚠️  Port ${PORT} in use — trying port ${fallback}`);
    app.listen(fallback, () =>
      console.log(`🚚 NG&J Swift running on http://localhost:${fallback}`)
    );
  } else {
    throw err;
  }
});
