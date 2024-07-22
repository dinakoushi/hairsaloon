const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
// Middleware
//app.use(cors());
app.use(express.json());
app.use(cors({
    origin: 'https://hairsaloon-38sl.onrender.com'
}));
// MongoDB Connection
//mongoose.connect("mongodb+srv://HBS_admin:HBS%40123@clusterown.wc7a6xv.mongodb.net/HBS?retryWrites=true&w=majority&appName=ClusterOwn", {
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
//})
//    .then(() => {
//        console.log("Successfully connected to MongoDB");
//    })
//    .catch((err) => {
//        console.error("Failed to connect to MongoDB", err);
//    });

// MongoDB Connection
mongoose.connect("mongodb+srv://HBS_admin:HBS%40123@clusterown.wc7a6xv.mongodb.net/HBS?retryWrites=true&w=majority&appName=ClusterOwn", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
// Define User Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    phoneNo: String,
    email: {
        type: String,
        unique: true, // Ensures email is unique
    },
    password: String,
    role: String,
});


const registerUser = mongoose.model("user", userSchema);

// Define Feedback Schema and Model
const feedbackSchema = new mongoose.Schema({
    userId: String,
    feedback: String,
});

const feedbackCol = mongoose.model("feedback", feedbackSchema);

// Define Booking Schema and Model
const bookingSchema = new mongoose.Schema({
    userId: String,
    date: String,
    serviceCode: String,
    serviceDesc: String,
    staffName: String,
    staffID: String,
    startTime: String,
    endTime: String,
    bookedAt: { type: Date, default: Date.now },
    status: String,
});

const booking = mongoose.model("appointment", bookingSchema);

// Define Service Details Schema and Model
const serviceDetailSchema = new mongoose.Schema({
    servicesCode: String,
    servicesDesc: String,
});

const servicedetail = mongoose.model('servicesDetail', serviceDetailSchema);

// Define Staff Details Schema and Model
const staffDetailSchema = new mongoose.Schema({
    staffName: String,
});

const staffdetail = mongoose.model('staffDetail', staffDetailSchema);

// Define Progress Schema and Model
const progressSchema = new mongoose.Schema({
    remark: String,
    appointmentId: String,
    filePath: String,  // Path or URL to the uploaded file
    imageId:String,
    createdAt: { type: Date, default: Date.now }
});

const progress = mongoose.model('progressTreatment', progressSchema);

// Register Route
app.post("/register", async (req, res) => {
    try {
        const { name, phoneNo, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await registerUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new user
        const newUser = new registerUser({ name, phoneNo, email, password, role });
        await newUser.save();

        // Remove password from response
        const result = newUser.toObject();
        delete result.password;

        res.status(201).json({ message: "User registered successfully", user: result });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await registerUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Validate password
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Remove password from response
        const result = user.toObject();
        delete result.password;

        res.status(200).json({ message: "Login successful", user: result });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Endpoint to validate old password
app.post('/validatePassword', async (req, res) => {
    const { userId, oldPassword } = req.body;

    try {
        const user = await registerUser.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password === oldPassword) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error validating password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to change password
app.put('/changePassword/:userId', async (req, res) => {
    const { userId } = req.params;
    const { password } = req.body;

    try {
        await registerUser.findByIdAndUpdate(userId, { password: password });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// View Profile Route
app.get("/profile/:id", async (req, res) => {
    try {
        console.log(`Fetching profile for ID: ${req.params.id}`);
        const user = await registerUser.findById(req.params.id); // Corrected this line
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        // Remove password from response
        const result = user.toObject();
        delete result.password;
        res.json(result);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Edit Profile Route
app.put("/profileEdit/:id", async (req, res) => {
    try {
        const updatedUser = await registerUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Remove password from response
        const result = updatedUser.toObject();
        delete result.password;
        res.json({ message: "Profile updated successfully", user: result });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Add Review Route
app.post("/addReview", async (req, res) => {
    try {
        const { feedback, userId } = req.body;

        // Create feedback
        const newFeedback = new feedbackCol({ feedback, userId });
        await newFeedback.save();

        res.status(201).json({ message: "Feedback submitted successfully"});
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Route to display all reviews
app.get('/reviewsList', async (req, res) => {
    try {
        const reviews = await feedbackCol.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get Booked Slots for a Specific Date
app.get('/bookedSlots', async (req, res) => {
    const { date, staffID } = req.query;

    try {
        const statuses = ['Approved', 'Pending'];

        const appointments = await booking.find({
            date: date,
            staffID: staffID,
            status: { $in: statuses }
        });

        const bookedSlots = appointments.map(appointment => ({
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            staffID: appointment.staffID,
            date: appointment.date
        }));

        res.json(bookedSlots);
    } catch (error) {
        console.error("Error fetching booked slots:", error);
        res.status(500).json({ message: "Failed to fetch booked slots." });
    }
});

// List Booking Route
app.post("/book", async (req, res) => {
    try {
        const { userId, date, serviceCode, serviceDesc, staffName, staffID, startTime, endTime, status } = req.body;

        const newBooking = new booking({
            userId,
            date,
            serviceCode,
            serviceDesc, 
            staffName,
            staffID,
            startTime,
            endTime,
            status,
        });

        await newBooking.save();
        res.status(201).json({ message: "Kindly wait for your booking confirmation!" });
    } catch (error) {
        console.error("Error booking:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Route to get all pending appointments with user details
app.get('/appointments/pendingBooking', async (req, res) => {
    try {
        const appointments = await booking.find({ status: 'Pending' });

        // Fetch user details for each appointment
        const appointmentsWithUsers = await Promise.all(
            appointments.map(async (appointment) => {
                const user = await registerUser.findById(appointment.userId);
                return {
                    appointmentId: appointment._id,
                    date: appointment.date,
                    serviceCode: appointment.serviceCode,
                    serviceDesc: appointment.serviceDesc,
                    startTime: appointment.startTime,
                    bookedAt: appointment.bookedAt,
                    status: appointment.status,
                    userDetails: user ? {
                        name: user.name,
                        email: user.email,
                        phoneNo: user.phoneNo // Add any additional fields you need
                    } : null
                };
            })
        );

        res.status(200).json(appointmentsWithUsers);
    } catch (error) {
        console.error('Error fetching pending appointments:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Route to update appointment status
app.put('/appointments/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const appointment = await booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', appointment });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Route to get all users with search functionality
app.get('/customers', async (req, res) => {
    const { search } = req.query;

    try {
        let query = { role: 'Customer'}; // Exclude admin roles
        if (search) {
            query = {
                $and: [
                    { role: 'Customer' }, // Exclude admin roles
                    {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { phoneNo: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }

        const customers = await registerUser.find(query);
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.get('/bookings/:customerId', async (req, res) => {
    const { customerId } = req.params;

    console.error(customerId);
    try {
        const bookings = await booking.find({ userId: customerId });
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.post('/api/progress/:appointmentId', upload.single('image'), async (req, res) => {
    const { description } = req.body;
    const appointmentId = req.params.appointmentId;

    try {
        const newProgress = {
            appointmentId,
            description,
            filePath: req.file.path,
            imageId: req.file.filename,
        };

        // Save newProgress to your database (e.g., MongoDB)
        await progress.create(newProgress);
        res.status(201).json({ message: "Progress updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update progress." });
    }
});

// Endpoint to fetch service details
app.get('/services', async (req, res) => {
    try {
        const services = await servicedetail.find();
        res.json(services);
    } catch (error) {
        res.status(500).send('Error fetching service details');
    }
});

app.get('/staff', async (req, res) => {
    try {
        const staff = await staffdetail.find();
        res.json(staff);
    } catch (error) {
        res.status(500).send('Error fetching staff details');
    }
});
app.use(express.static(path.join(__dirname, 'public')));

app.post('/updateProgress', upload.single('file'), (req, res) => {
    const { remark, appointmentId } = req.body;
    cloudinary.uploader.upload_stream({
        folder: 'HudaHairSalon',
        public_id: uuidv4(),
    }, async (error, result) => {
        if (result) {
            console.error('remark:', remark);
            // Save image details to MongoDB
            const newProgress = new progress({
                remark,
                appointmentId,
                filePath: result.secure_url,
                imageId: result.public_id,
            });

            try {
                await newProgress.save();
                res.json({ message: 'Data saved successfully', progress: newProgress });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        } else {
            res.status(500).json({ error: error.message });
        }
    }).end(req.file.buffer);
});
// Define a POST route to fetch appointment details by ID
app.post('/appointments/details', async (req, res) => {
    try {
        const { appointmentId } = req.body; 

        if (!appointmentId) {
            return res.status(400).json({ error: 'Appointment ID is required.' });
        }

        
        const appointment = await progress.findOne({ appointmentId }).exec();;

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        res.json(appointment);
    } catch (error) {
        console.error('Error fetching appointment details:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
