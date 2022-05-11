const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/api');

const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(apiRoutes);

// if you didn't import and pass in the routes, you could also write it out yourself:
// app.use('/', require('./routes/user'));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})