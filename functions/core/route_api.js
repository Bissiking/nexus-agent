const express = require('express');
const res = require('express/lib/response');
const app = express();
const { exec } = require("child_process");
const fs = require("fs");
const osu = require('node-os-utils');
var path = require('path');

// CONST API

const Mod = 'API - "app"';

// ----------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/', (req, res) => {
    return res.status(200).json('{"check": "test"}');
});

app.get('/monitoring/last/:id', (req, res) => {
    let id = req.params.id;
    fs.readFile('./logs/last_monitoring/' + id + '_last.json', "utf8", function (err, data) {
        if (err) {
            return res.status(404).json({ message: 'not_found' });
        }
        return res.status(200).json({ data: data });
    })
});

app.get('/monitoring/:id', (req, res) => {
    let id = req.params.id;
    fs.readFile('./logs/monitoring/' + id + '_last.json', "utf8", function (err, data) {
        if (err) {
            return res.status(404).json({ message: 'not_found' });
        }
        return res.status(200).json({ data: data });
    })
});


module.exports = app;