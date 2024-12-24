const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Variable pour stocker les résultats du scan
let scanResults = [];

// Endpoint pour déclencher un scan (ne fait qu'envoyer une confirmation)
app.post('/scan', (req, res) => {
    console.log("Scan déclenché.");
    res.status(200).json({ message: "Scan en cours, résultats attendus." });
});

// Endpoint pour recevoir les résultats envoyés par Flask
app.post('/results', (req, res) => {
    try {
        console.log("Données reçues : ", req.body);

        const { data } = req.body; 
        if (data && Array.isArray(data)) {
            scanResults.push(...data); // Ajouter les nouveaux résultats à la liste existante
            res.status(200).json({ message: "Résultats reçus avec succès" });
        } else {
            res.status(400).json({ error: "Format de données invalide" });
        }
    } catch (error) {
        console.error("Erreur lors de la réception des résultats :", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Endpoint de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Serveur Express opérationnel !');
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
