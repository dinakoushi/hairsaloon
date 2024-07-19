const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://HBS_admin:HBS%40123@clusterown.wc7a6xv.mongodb.net/HBS?retryWrites=true&w=majority&appName=ClusterOwn", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Successfully connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

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
// Define User Schema and Model
const feedbackSchema = new mongoose.Schema({
    userId: String,
    feedback: String,
});

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

const serviceDetailSchema = new mongoose.Schema({
    servicesCode: String,
    servicesDesc: String,
});

const staffDetailSchema = new mongoose.Schema({
    staffName: String,
});

const progressSchema = new mongoose.Schema({
    remark: String,
    appointmentId: String,
    filePath: String,  // Path or URL to the uploaded file
    createdAt: { type: Date, default: Date.now }
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });
const staffdetail = mongoose.model('staffDetail', staffDetailSchema);

const servicedetail = mongoose.model('servicesDetail', serviceDetailSchema);
const progress = mongoose.model('progressTreatment', progressSchema);
const registerUser = mongoose.model("user", userSchema);
const feedbackCol = mongoose.model("feedback", feedbackSchema);
//const booking = mongoose.model("progresstreatment", bookingSchema);
const booking = mongoose.model("appointment", bookingSchema);


//const bcrypt = require('bcrypt');
//userSchema.methods.comparePassword = function (candidatePassword) {
//    return bcrypt.compare(candidatePassword, this.password);
//};
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

// Example routes for password validation and change
//app.post('/validatePassword', async (req, res) => {
//    const { id, oldPassword } = req.body;
//    // Fetch user from DB and check oldPassword
//    const user = await registerUser.findById(id);
//    const isMatch = await user.comparePassword(oldPassword); // Implement password comparison logic
//    res.json({ valid: isMatch });
//});

//app.put('/changePassword/:id', async (req, res) => {
//    const { password } = req.body;
//    const user = await registerUser.findById(req.params.id);
//    user.password = password; // Hash the password before saving
//    await user.save();
//    res.json({ message: 'Password updated successfully' });
//});

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
    const { date } = req.query;

    try {
        // Fetch all bookings for the specified date
        const appointments = await booking.find({ date: date, status: 'Approved' });

        // Create an array of booked slots with start time, end time, and hairstylists
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

// Booking Route
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
                    time: appointment.time,
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
            image: req.file.path // Assuming you're using multer to handle image uploads
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

app.post('/updateProgress', upload.single('file'), async (req, res) => {
    const { remark, appointmentId } = req.body;
    const file = req.file;

    // Create a new progress record
    const newProgress = new progress({
        remark,
        appointmentId,
        filePath: file ? file.path : null // Save the file path
    });

    try {
        // Save the progress record to MongoDB
        await newProgress.save();
        res.json({ message: 'Data saved successfully', progress: newProgress });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ message: 'Failed to save progress', error });
    }
});

// Define a POST route to fetch appointment details by ID
app.post('/appointments/details', async (req, res) => {
    try {
        const { appointmentId } = req.body; // Extract appointmentId from request body

        if (!appointmentId) {
            return res.status(400).json({ error: 'Appointment ID is required.' });
        }

        console.error('appointmentId:', appointmentId);
        // Fetch appointment details by ID
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
