const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let scanResults = [];
let registeredUrls = []; 

app.post('/register', (req, res) => {
    const { url, hostname } = req.body; 

    if (url && hostname) {
        registeredUrls = registeredUrls.filter(entry => entry.hostname !== hostname);

        registeredUrls.push({ url, hostname, timestamp: new Date() });

        res.status(200).send({ message: "URL enregistrée avec succès." });
    } else {
        res.status(400).send({ error: "URL ou hostname manquant." });
    }
});

app.get('/urls', (req, res) => {
    res.status(200).send(registeredUrls);
});

app.post('/scan', async (req, res) => {
    try {
        let scanResults = [];

        for (const entry of registeredUrls) {
            try {
                const response = await axios.post(`${entry.url}/scan`);
                scanResults.push(...response.data);
            } catch (error) {
                console.error(`Erreur lors de la requête vers ${entry.url}:`, error.message);
            }
        }

        res.status(200).send(scanResults);
    } catch (error) {
        console.error("Erreur lors de la récupération des résultats de scan :", error.message);
        res.status(500).send({ error: "Erreur lors du scan." });
    }
});

app.post('/results', (req, res) => {
    try {
        const { data } = req.body; 
        if (data && Array.isArray(data)) {
            scanResults.push(...data); 
            res.status(200).json({ message: "Résultats reçus avec succès" });
        } else {
            res.status(400).json({ error: "Format de données invalide" });
        }
    } catch (error) {
        console.error("Erreur lors de la réception des résultats :", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

app.get('/', (req, res) => {
    res.send('Serveur Express opérationnel !');
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
