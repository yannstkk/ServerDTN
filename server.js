const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let scanResults = [];

app.post('/scan', async (req, res) => {
    try {
        const broadcastEndpoint = 'http://localhost:5000/scan'; 

        scanResults = []; 
        try {
            const response = await axios.post(broadcastEndpoint);
            console.log("Réponse du broadcast 22 : ", response.data);  

            if (response.data && Array.isArray(response.data)) {
                scanResults = response.data;
            } else {
                throw new Error("Résultats inattendus du broadcast");
            }
        } catch (error) {
            console.error("Erreur lors du broadcast :", error.message);
        }

        res.status(200).json(scanResults);
    } catch (error) {
        console.error("Erreur lors de l'ordre de scan :", error.message);
        res.status(500).json({ error: "Erreur lors de l'ordre de scan." });
    }
});

app.post('/results', (req, res) => {
    try {
        console.log("Données reçues 33 : ", req.body); 


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
