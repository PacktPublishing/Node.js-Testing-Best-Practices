import * as fs from "fs";
import * as util from "util";
import * as url from "url";
import { PlaylistDal } from "./dal/dal-playlists";
import { Logger } from "./logger";
import { IConfiguration } from "./types/config";
import { ListItem } from "./types/list-item";
import * as express from "express";
import * as cors from "cors";
import { Playlist } from "playlist";
import bodyParser = require("body-parser");
import { SongDal } from "./dal/dal-songs";
// convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

// getting the configuration from file for now
async function getConfig(): Promise<IConfiguration> {
  let content: any = await readFile("./config.json", "utf8");
  return JSON.parse(content) as IConfiguration;
}

async function main() {
  let playlists: PlaylistDal = new PlaylistDal();
  let conf = await getConfig();

  let mongoHost = process.env["MONGO_SERVICE_HOST"] || "localhost";
  let mongoPort = process.env["MONGO_SERVICE_PORT_TCP"] || "27017";
  let mongoDbName = process.env["MONGO_SERVICE_DB_NAME"] || "demo1";
  let logger = new Logger(conf.logLevel);

  let mongoConnStr =
    "mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDbName;
  logger.info("connecting to db:", mongoConnStr);

  let songs: SongDal = new SongDal(logger, mongoConnStr);

  songs.delete();
  songs.populate("songs.json");
  logger.info("loglevel:", logger.logLevel);
  logger.debug("running with configuration: ", JSON.stringify(conf));

  // no authentication yet, set our user as #2
  let currentUserId = "2";

  logger.debug("running with configuration: ", JSON.stringify(conf));

  // now using a cors header (allow origin)
  let app: express.Express = express();

  app.use(bodyParser.json());

  app.use(cors());
  app.get(
    "/v1/playlists",
    (req: express.Request, res: express.Response): any => {
      let urlParts = url.parse(req.url, true);
      let query = urlParts.query;
      let plists: Playlist[] = [];
      if (req.query.id) {
        let id: string = req.query.id;
        let plist = playlists.getPlaylistById(id);
        plists = [plist];
      } else if (req.query.userId) {
        let userId = req.query.userId;
        let owned: boolean = req.query.onlyOwned === "true";
        if (!owned) {
          owned = false;
        }
        plists = playlists.getPlaylistsByUser(userId, owned);
      }
      if (plists) {
        res.send(plists);
      }
    }
  );

  app.post(
    "/v1/playlists/:id/",
    (req: express.Request, res: express.Response): any => {
      let urlParts = url.parse(req.url, true);
      let listId: string = req.params.id as string;
      let songId: string = urlParts.query.songId as string;
      let err = playlists.addItemToPlaylist(currentUserId, listId, songId);
      if (err) {
        res.status(401).send(err.message);
      }
      res.end("success");
    }
  );

  app.delete(
    "/v1/playlists/:id/",
    (req: express.Request, res: express.Response): any => {
      let urlParts = url.parse(req.url, true);
      let listId: string = req.params.id as string;
      let songId: string = urlParts.query.songId as string;
      let err = playlists.removeItemFromPlaylist(currentUserId, listId, songId);
      if (err) {
        res.status(401).send(err.message);
      }
      res.end("success");
    }
  );
  // add a playlist
  app.post(
    "/v1/playlists",
    (req: express.Request, res: express.Response): any => {
      let listItem: Playlist = req.body;
      if (listItem) {
        let id: string = req.query.id;
        let plist = playlists.addNewPlaylist(listItem.name, listItem.creatorId);
        res.send(plist);
      } else {
        logger.error("Playlists API post: no list item in body!");
        res.status(404).send("No Item to add");
      }
    }
  );

  // delete a playlist
  app.delete(
    "/v1/playlists",
    (req: express.Request, res: express.Response): any => {
      let urlParts = url.parse(req.url, true);
      let listId: string = urlParts.query.id as string;
      if (listId) {
        let err = playlists.delPlaylist(currentUserId, listId);
        if (err) {
          res.status(401).send(err.message);
        }
        res.end("success");
      } else {
        logger.error("Playlists API delete: no id in query!");
        res.status(404).send("No Item found to delete");
      }
    }
  );

  app.get("/v1/songs", async (req: express.Request, res: express.Response) => {
    let urlParts = url.parse(req.url, true);

    let id: string = req.query.id;
    if (id) {
      let song = await songs.getSongById(id);
      res.send(song);
    } else if (req.query.q) {
      let query = req.query.q;
      res.send(await songs.getSongSearch(query));
    } else {
      res.send(await songs.getAllSongs());
    }
  });

  app.listen(3002, () => {
    logger.info("Service listening on port 3002!");
  });
}
main();
