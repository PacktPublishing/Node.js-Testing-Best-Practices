import { ISong } from "../types/song";
import mongoose = require("mongoose");
import { Logger } from "../logger";
import * as fs from "fs";

export class SongDal {
  public map: Map<string, ISong> = new Map<string, ISong>();
  private db: mongoose.Connection;
  private logger: Logger;
  public songModel: mongoose.Model<mongoose.Document>;
  private songsModelSchema: mongoose.Schema;
  constructor(logger: Logger, mongoConnStr: string) {
    // Define a schema
    this.songsModelSchema = new mongoose.Schema({
      name: String,
      id: String,
      artist: String
    });

    this.songModel = mongoose.model("Songs", this.songsModelSchema);
    // Set up default mongoose connection

    // let mongoDB = "mongodb://" + host + ":" + port + "/demo1";
    mongoose.connect(mongoConnStr, { useNewUrlParser: true });
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;
    // Get the default connection
    this.db = mongoose.connection;
    this.logger = logger;
    // Bind connection to error event (to get notification of connection errors)
    this.db.on("error", err => {
      this.logger.error("MongoDB connection error:", err);
    });
  }

  // populate adds all songs to the database, it is meant for demo purposes only
  public async populate(jsonFilePath: string): Promise<boolean> {
    this.map = new Map();
    this.songModel = mongoose.model("Songs", this.songsModelSchema);
    let contents = fs.readFileSync(jsonFilePath);
    let songArr: ISong[] = JSON.parse(contents.toString());

    let res = await this.songModel.insertMany(songArr);
    return res.length > 0;
  }

  public async delete() {
    this.db.dropCollection("songs");
  }

  private mongo2song(doc: mongoose.Document): ISong {
    let song = {
      id: doc["id"],
      playtimeSecs: doc["playtimeSecs"] || 0,
      name: doc["name"] || "",
      artist: doc["artist"] || "",
      link: doc["link"] || "",
      fullName: doc["name"] + " " + doc["artist"]
    };
    return song;
  }
  public async getAllSongs(): Promise<ISong[]> {
    return this.getSongSearch(".*");
  }

  public async getSongSearch(q: string): Promise<ISong[]> {
    let songs: ISong[] = [];

    // ignore this huge security issue for the sake of the sample...
    let re = new RegExp(q, "i");

    // search for the partial string in the collection as artist
    let retList = await this.songModel
      .find({
        $or: [{ artist: re }, { name: re }]
      })
      .exec();

    for (let i = 0; i < retList.length; i++) {
      let doc = retList[i];
      let song = this.mongo2song(doc);
      songs.push(song);
    }

    return songs;
  }

  public async getSongById(id1: string): Promise<ISong> {
    let res = await this.songModel.find({ id: id1 }).exec();
    let doc = res[0];
    if (!res || !res[0]) return undefined;

    let song = this.mongo2song(doc);
    return song;
  }

  public async deleteSongById(id1: string): Promise<boolean> {
    let res = await this.songModel.deleteOne({ id: id1 }).exec();
    return res.ok == 1;
  }

  public async addSong(
    name: string,
    artist: string,
    link: string,
    playtimeSecs: number
  ): Promise<ISong> {
    let song1: ISong = {
      id: 0,
      playtimeSecs: playtimeSecs,
      name: name || "",
      artist: artist || "",
      link: link || ""
    };

    let res = await this.songModel.create(song1);
    return this.mongo2song(res);
  }

  public async stop() {
    await mongoose.disconnect();
  }
}
