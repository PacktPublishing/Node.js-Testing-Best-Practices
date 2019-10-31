"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
const url = require("url");
const dal_playlists_1 = require("./dal/dal-playlists");
const logger_1 = require("./logger");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dal_songs_1 = require("./dal/dal-songs");
// convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);
// getting the configuration from file for now
async function getConfig() {
    let content = await readFile("./config.json", "utf8");
    return JSON.parse(content);
}
async function main() {
    let playlists = new dal_playlists_1.PlaylistDal();
    let conf = await getConfig();
    let mongoHost = process.env["MONGO_SERVICE_HOST"] || "localhost";
    let mongoPort = process.env["MONGO_SERVICE_PORT_TCP"] || "27017";
    let mongoDbName = process.env["MONGO_SERVICE_DB_NAME"] || "demo1";
    let logger = new logger_1.Logger(conf.logLevel);
    let mongoConnStr = "mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDbName;
    logger.info("connecting to db:", mongoConnStr);
    let songs = new dal_songs_1.SongDal(logger, mongoConnStr);
    songs.delete();
    songs.populate("songs.json");
    logger.info("loglevel:", logger.logLevel);
    logger.debug("running with configuration: ", JSON.stringify(conf));
    // no authentication yet, set our user as #2
    let currentUserId = "2";
    logger.debug("running with configuration: ", JSON.stringify(conf));
    // now using a cors header (allow origin)
    let app = express();
    app.use(bodyParser.json());
    // let corsOptions: cors.CorsOptions = {
    //     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    //     origin: "http://localhost:3001",
    // };
    app.use(cors());
    app.get("/v1/playlists", (req, res) => {
        let urlParts = url.parse(req.url, true);
        let query = urlParts.query;
        let plists = [];
        if (req.query.id) {
            let id = req.query.id;
            let plist = playlists.getPlaylistById(id);
            plists = [plist];
        }
        else if (req.query.userId) {
            let userId = req.query.userId;
            let owned = req.query.onlyOwned === "true";
            if (!owned) {
                owned = false;
            }
            plists = playlists.getPlaylistsByUser(userId, owned);
        }
        if (plists) {
            res.send(plists);
        }
    });
    app.post("/v1/playlists/:id/", (req, res) => {
        let urlParts = url.parse(req.url, true);
        let listId = req.params.id;
        let songId = urlParts.query.songId;
        let err = playlists.addItemToPlaylist(currentUserId, listId, songId);
        if (err) {
            res.status(401).send(err.message);
        }
        res.end("success");
    });
    app.delete("/v1/playlists/:id/", (req, res) => {
        let urlParts = url.parse(req.url, true);
        let listId = req.params.id;
        let songId = urlParts.query.songId;
        let err = playlists.removeItemFromPlaylist(currentUserId, listId, songId);
        if (err) {
            res.status(401).send(err.message);
        }
        res.end("success");
    });
    // add a playlist
    app.post("/v1/playlists", (req, res) => {
        let listItem = req.body;
        if (listItem) {
            let id = req.query.id;
            let plist = playlists.addNewPlaylist(listItem.name, listItem.creatorId);
            res.send(plist);
        }
        else {
            logger.error("Playlists API post: no list item in body!");
            res.status(404).send("No Item to add");
        }
    });
    // delete a playlist
    app.delete("/v1/playlists", (req, res) => {
        let urlParts = url.parse(req.url, true);
        let listId = urlParts.query.id;
        if (listId) {
            let err = playlists.delPlaylist(currentUserId, listId);
            if (err) {
                res.status(401).send(err.message);
            }
            res.end("success");
        }
        else {
            logger.error("Playlists API delete: no id in query!");
            res.status(404).send("No Item found to delete");
        }
    });
    app.get("/v1/songs", async (req, res) => {
        let urlParts = url.parse(req.url, true);
        let id = req.query.id;
        if (id) {
            let song = await songs.getSongById(id);
            res.send(song);
        }
        else if (req.query.q) {
            let query = req.query.q;
            res.send(await songs.getSongSearch(query));
        }
        else {
            res.send(await songs.getAllSongs());
        }
    });
    app.listen(3002, () => {
        logger.info("Service listening on port 3002!");
    });
}
main();
//# sourceMappingURL=app.js.map