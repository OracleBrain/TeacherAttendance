const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const crypto = require("crypto");
const util = require("util");
const mongoose = require("mongoose");
const connectMongo = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5000", "http://0.0.0.0:5000", "http://127.0.0.1:5000", "https://0.0.0.0:5000"],
  credentials: true
}));
app.use(express.json());

// MongoDB connection URI (if provided)
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Models
const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['teacher'], default: 'teacher' },
  createdAt: { type: Date, default: Date.now }
});

const classSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  teacherId: { type: Number, required: true }
});

const studentSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  classId: { type: Number, required: true }
});

const attendanceSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  studentId: { type: Number, required: true },
  classId: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  teacherId: { type: Number, required: true }
});

const notificationSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  userId: { type: Number, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const counterSchema = new mongoose.Schema({
  modelName: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 }
});

// Create MongoDB models
const UserModel = mongoose.model('User', userSchema);
const ClassModel = mongoose.model('Class', classSchema);
const StudentModel = mongoose.model('Student', studentSchema);
const AttendanceModel = mongoose.model('Attendance', attendanceSchema);
const NotificationModel = mongoose.model('Notification', notificationSchema);
const CounterModel = mongoose.model('Counter', counterSchema);

// Function to get the next ID for a model
async function getNextId(modelName) {
  const counter = await CounterModel.findOneAndUpdate(
    { modelName },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
  return counter.count;
}

// MongoDB session store
const MongoStore = connectMongo;

// Create a variable for session store that we can modify later
let sessionStoreInstance;

// If MongoDB URI is provided, use MongoDB session store
if (MONGODB_URI) {
  try {
    sessionStoreInstance = MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions',
      ttl: 86400 // 1 day
    });
  } catch (err) {
    console.error('Error creating MongoDB session store:', err);
    // Will be set to MemoryStore in the useInMemoryMode function
    sessionStoreInstance = null;
  }
} else {
  // Will be set to MemoryStore in the useInMemoryMode function
  sessionStoreInstance = null;
}

// MongoDB storage
const storage = {
  sessionStore: sessionStoreInstance,
  
  // User methods
  getUser: async function(id) {
    const user = await UserModel.findOne({ id }).lean();
    if (!user) return undefined;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  getUserByUsername: async function(username) {
    return await UserModel.findOne({ username }).lean();
  },
  
  createUser: async function(user) {
    const id = await getNextId('User');
    
    const newUser = {
      ...user,
      id,
      createdAt: new Date()
    };
    
    await UserModel.create(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  // Class methods
  getClassesByTeacherId: async function(teacherId) {
    return await ClassModel.find({ teacherId }).lean();
  },
  
  // Student methods
  getStudentsByClassId: async function(classId) {
    return await StudentModel.find({ classId }).lean();
  },
  
  // Attendance methods
  getAttendanceByClassId: async function(classId, date) {
    const query = { classId };
    if (date) {
      query.date = date;
    }
    return await AttendanceModel.find(query).lean();
  },
  
  markAttendance: async function(attendance) {
    const id = await getNextId('Attendance');
    
    const newAttendance = {
      ...attendance,
      id
    };
    
    await AttendanceModel.create(newAttendance);
    return newAttendance;
  },
  
  // Notification methods
  getNotificationsByUserId: async function(userId) {
    return await NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean();
  },
  
  markNotificationAsRead: async function(id) {
    const notification = await NotificationModel.findOneAndUpdate(
      { id },
      { read: true },
      { new: true }
    ).lean();
    
    if (!notification) {
      throw new Error("Notification not found");
    }
    
    return notification;
  },
  
  // Function to initialize sample data
  async initializeData() {
    // Only add sample data if no classes exist
    const classCount = await ClassModel.countDocuments();
    if (classCount === 0) {
      // Add sample classes
      await ClassModel.create([
        { id: await getNextId('Class'), name: "Class 10", section: "A", subject: "Mathematics", teacherId: 1 },
        { id: await getNextId('Class'), name: "Class 9", section: "B", subject: "Science", teacherId: 1 },
        { id: await getNextId('Class'), name: "Class 8", section: "C", subject: "English", teacherId: 1 }
      ]);
      
      // Add sample students
      await StudentModel.create([
        { id: await getNextId('Student'), name: "John Doe", rollNumber: "10A01", classId: 1 },
        { id: await getNextId('Student'), name: "Jane Smith", rollNumber: "10A02", classId: 1 },
        { id: await getNextId('Student'), name: "Bob Johnson", rollNumber: "10A03", classId: 1 },
        { id: await getNextId('Student'), name: "Alice Brown", rollNumber: "9B01", classId: 2 },
        { id: await getNextId('Student'), name: "Charlie Davis", rollNumber: "9B02", classId: 2 },
        { id: await getNextId('Student'), name: "Eva Wilson", rollNumber: "8C01", classId: 3 }
      ]);
      
      // Add welcome notification template
      await NotificationModel.create({
        id: await getNextId('Notification'),
        userId: 1,
        title: "Welcome to the Attendance App",
        message: "Thank you for joining our attendance management system.",
        read: false,
        createdAt: new Date()
      });
    }
  }
};

// Authentication setup
const scryptAsync = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64));
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64));
  return crypto.timingSafeEqual(hashedBuf, suppliedBuf);
}

// Session configuration
const sessionSettings = {
  secret: process.env.SESSION_SECRET || "attendance-app-super-secret",
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore,
};

app.set("trust proxy", 1);
app.use(session(sessionSettings));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await storage.getUserByUsername(username);
    if (!user || !(await comparePasswords(password, user.password))) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  }),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await storage.getUser(id);
  done(null, user);
});

// Auth routes
app.post("/api/register", async (req, res, next) => {
  const existingUser = await storage.getUserByUsername(req.body.username);
  if (existingUser) {
    return res.status(400).send("Username already exists");
  }

  const user = await storage.createUser({
    ...req.body,
    password: await hashPassword(req.body.password),
  });

  req.login(user, (err) => {
    if (err) return next(err);
    res.status(201).json(user);
  });
});

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json(req.user);
});

app.post("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

app.get("/api/user", (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  res.json(req.user);
});

// API Routes
// Classes
app.get("/api/classes", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const teacherId = req.user?.id;
  const classes = await storage.getClassesByTeacherId(teacherId);
  res.json(classes);
});

// Students by class
app.get("/api/classes/:classId/students", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const classId = parseInt(req.params.classId);
  const students = await storage.getStudentsByClassId(classId);
  res.json(students);
});

// Attendance
app.get("/api/classes/:classId/attendance", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const classId = parseInt(req.params.classId);
  const date = req.query.date;
  const attendance = await storage.getAttendanceByClassId(classId, date);
  res.json(attendance);
});

app.post("/api/attendance", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const { studentId, classId, date, status } = req.body;
  const teacherId = req.user?.id;
  
  const newAttendance = await storage.markAttendance({
    studentId,
    classId,
    date,
    status,
    teacherId
  });
  
  res.status(201).json(newAttendance);
});

// Notifications
app.get("/api/notifications", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const userId = req.user?.id;
  const notifications = await storage.getNotificationsByUserId(userId);
  res.json(notifications);
});

app.put("/api/notifications/:id/read", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const id = parseInt(req.params.id);
  const notification = await storage.markNotificationAsRead(id);
  res.json(notification);
});

// In-memory data storage (used when MongoDB is not available)
const inMemoryStorage = {
  users: [],
  classes: [
    { id: 1, name: "Class 10", section: "A", subject: "Mathematics", teacherId: 1 },
    { id: 2, name: "Class 9", section: "B", subject: "Science", teacherId: 1 },
    { id: 3, name: "Class 8", section: "C", subject: "English", teacherId: 1 }
  ],
  students: [
    { id: 1, name: "John Doe", rollNumber: "10A01", classId: 1 },
    { id: 2, name: "Jane Smith", rollNumber: "10A02", classId: 1 },
    { id: 3, name: "Bob Johnson", rollNumber: "10A03", classId: 1 },
    { id: 4, name: "Alice Brown", rollNumber: "9B01", classId: 2 },
    { id: 5, name: "Charlie Davis", rollNumber: "9B02", classId: 2 },
    { id: 6, name: "Eva Wilson", rollNumber: "8C01", classId: 3 }
  ],
  attendance: [],
  notifications: [
    { 
      id: 1, 
      userId: 1, 
      title: "Welcome to the Attendance App", 
      message: "Thank you for joining our attendance management system.", 
      read: false, 
      createdAt: new Date() 
    }
  ],
  counters: {}
};

// Fallback in-memory methods (when MongoDB is not available)
const fallbackStorage = {
  getNextId: function(modelName) {
    if (!inMemoryStorage.counters[modelName]) {
      inMemoryStorage.counters[modelName] = 1;
    }
    return inMemoryStorage.counters[modelName]++;
  },
  
  getUser: function(id) {
    const user = inMemoryStorage.users.find(u => u.id === id);
    if (!user) return undefined;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  getUserByUsername: function(username) {
    return inMemoryStorage.users.find(u => u.username === username);
  },
  
  createUser: function(user) {
    const id = fallbackStorage.getNextId('user');
    
    const newUser = {
      ...user,
      id,
      createdAt: new Date()
    };
    
    inMemoryStorage.users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  getClassesByTeacherId: function(teacherId) {
    return inMemoryStorage.classes.filter(c => c.teacherId === teacherId);
  },
  
  getStudentsByClassId: function(classId) {
    return inMemoryStorage.students.filter(s => s.classId === classId);
  },
  
  getAttendanceByClassId: function(classId, date) {
    let results = inMemoryStorage.attendance.filter(a => a.classId === classId);
    if (date) {
      results = results.filter(a => a.date === date);
    }
    return results;
  },
  
  markAttendance: function(attendance) {
    const id = fallbackStorage.getNextId('attendance');
    
    const newAttendance = {
      ...attendance,
      id
    };
    
    inMemoryStorage.attendance.push(newAttendance);
    return newAttendance;
  },
  
  getNotificationsByUserId: function(userId) {
    return inMemoryStorage.notifications.filter(n => n.userId === userId);
  },
  
  markNotificationAsRead: function(id) {
    const notification = inMemoryStorage.notifications.find(n => n.id === id);
    if (!notification) {
      throw new Error("Notification not found");
    }
    
    notification.read = true;
    return notification;
  }
};

// Try to connect to MongoDB or use in-memory mode
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB successfully');
      
      // Initialize sample data
      await storage.initializeData();
      
      // Start the server
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running with MongoDB on http://0.0.0.0:${PORT}`);
      });
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB, falling back to in-memory storage:', err);
      useInMemoryMode();
    });
} else {
  console.log('No MongoDB URI provided, using in-memory storage mode');
  useInMemoryMode();
}

// Function to set up in-memory mode
function useInMemoryMode() {
  // Use in-memory session store
  const MemoryStore = require("memorystore")(session);
  const memorySessionStore = new MemoryStore({
    checkPeriod: 86400000
  });
  
  // Override storage methods with in-memory implementations
  storage.getUser = fallbackStorage.getUser;
  storage.getUserByUsername = fallbackStorage.getUserByUsername;
  storage.createUser = fallbackStorage.createUser;
  storage.getClassesByTeacherId = fallbackStorage.getClassesByTeacherId;
  storage.getStudentsByClassId = fallbackStorage.getStudentsByClassId;
  storage.getAttendanceByClassId = fallbackStorage.getAttendanceByClassId;
  storage.markAttendance = fallbackStorage.markAttendance;
  storage.getNotificationsByUserId = fallbackStorage.getNotificationsByUserId;
  storage.markNotificationAsRead = fallbackStorage.markNotificationAsRead;
  storage.sessionStore = memorySessionStore;
  
  // Update session middleware to use memory store
  app.use(session({
    ...sessionSettings,
    store: memorySessionStore
  }));
  
  // Start the server with in-memory storage
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running with in-memory storage on http://0.0.0.0:${PORT}`);
  });
}