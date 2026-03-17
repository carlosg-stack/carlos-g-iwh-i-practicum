require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data.
app.get('/', async (req, res) => {
    const customObjectID = '2-226859943';
    const endpoint = `https://api.hubspot.com/crm/v3/objects/${customObjectID}?properties=name,type,character_trait`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(endpoint, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot Foundations', data });      
    } catch (error) {
        console.error("Error retrieving data:", error.response ? error.response.data : error.message);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data.
app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data.
app.post('/update-cobj', async (req, res) => {
    const customObjectID = '2-226859943';
    const endpoint = `https://api.hubspot.com/crm/v3/objects/${customObjectID}`;
    
    const update = {
        properties: {
            "name": req.body.new_name,
            "type": req.body.new_type,
            "character_trait": req.body.new_trait
        }
    }

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(endpoint, update, { headers });
        res.redirect('/');
    } catch(err) {
        console.error("Error creating record:", err.response ? err.response.data : err.message);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));