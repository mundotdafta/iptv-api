const express = require('express');
const router = express.Router();

// Mock database to store devices
let devices = {};

// POST /register-device: Register a new device
router.post('/register-device', (req, res) => {
    const { username, uuid } = req.body;

    if (!username || !uuid) {
        return res.status(400).json({ message: 'Username and UUID are required.' });
    }

    if (!devices[username]) {
        devices[username] = [];
    }

    // Check if the device already exists
    if (devices[username].some(device => device.uuid === uuid)) {
        return res.status(409).json({ message: 'Device already registered.' });
    }

    // Register the device
    devices[username].push({ uuid });
    return res.status(201).json({ message: 'Device registered successfully.', devices: devices[username] });
});

// GET /devices/:username: Get devices for a user
router.get('/devices/:username', (req, res) => {
    const { username } = req.params;

    if (!devices[username]) {
        return res.status(404).json({ message: 'No devices found for this username.' });
    }

    return res.status(200).json(devices[username]);
});

// DELETE /devices/:username/:uuid: Delete a device
router.delete('/devices/:username/:uuid', (req, res) => {
    const { username, uuid } = req.params;

    if (!devices[username]) {
        return res.status(404).json({ message: 'No devices found for this username.' });
    }

    devices[username] = devices[username].filter(device => device.uuid !== uuid);
    return res.status(200).json({ message: 'Device deleted successfully.', devices: devices[username] });
});

module.exports = router;