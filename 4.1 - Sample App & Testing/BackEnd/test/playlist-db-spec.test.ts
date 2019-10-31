import { PlaylistDal } from "../src/dal/dal-playlists";
import { SongDal } from "../src/dal/dal-songs";
import { ListItem } from "../src/types/list-item";
import chai = require("chai");
import { Playlist } from "../src/types/playlist";
import { Logger } from "../src/logger";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";
const expect = chai.expect;

describe("Backend Server Data Access", () => {
  describe("Playlist Data Access", () => {
    it("returns a playlist for an existing listId", () => {
      let db = new PlaylistDal();
      let myTestListId = db.addNewPlaylist("testlist1", "333");
      let plist = db.getPlaylistById(myTestListId);

      expect(plist, "no list was returned").to.not.be.undefined;
      expect(plist.name, "retrieved list has wrong name").to.equal("testlist1");

      db.delPlaylist("2", myTestListId);
    });

    it("returns list results for user", () => {
      let db = new PlaylistDal();
      let myTestListId = db.addNewPlaylist("testlist1", "333");
      let myTestListId1 = db.addNewPlaylist("testlist2", "333");
      let plists = db.getPlaylistsByUser("333", true);

      expect(plists.length).to.equal(2, "our test user should have 2 lists");

      db.delPlaylist("2", myTestListId);
      db.delPlaylist("2", myTestListId1);
    });

    it("adds a Playlist", () => {
      let db = new PlaylistDal();
      let myTestListId = db.addNewPlaylist("testlist1", "2");

      expect(db.getPlaylistById(myTestListId)).to.not.be.undefined;
      db.delPlaylist("2", myTestListId);
    });

    it("adds an item to list", () => {
      let db = new PlaylistDal();
      let myTestListId = db.addNewPlaylist("testlist1", "2");
      db.addItemToPlaylist("2", myTestListId, "23");

      let playlist = db.getPlaylistById(myTestListId);

      expect(playlist.songIds).to.contain(
        "23",
        "item isn't in playlist after adding it"
      );

      db.delPlaylist("2", myTestListId);
    });

    it("deletes a list item", () => {
      let db = new PlaylistDal();
      let myTestListId = db.addNewPlaylist("testlist1", "2");
      db.addItemToPlaylist("2", myTestListId, "23");

      db.removeItemFromPlaylist("2", myTestListId, "23");
      let playlist = db.getPlaylistById(myTestListId);

      expect(playlist.songIds).to.not.contain(
        "23",
        "item exists in list after deletion"
      );

      db.delPlaylist("2", myTestListId);
    });

    it("deletes a Playlist", () => {
      let db = new PlaylistDal();
      let myTestListId = db.addNewPlaylist("testlist1", "2");

      db.delPlaylist("2", myTestListId);
      expect(db.getPlaylistById(myTestListId), "deletion did not succeed").to.be
        .undefined;
    });
  });

  describe("Songs Data Access", async () => {
    let songs: SongDal;
    let mongod: MongoMemoryServer;
    before(async () => {
      // create an in memory mongo instance just for testing:
      mongod = new MongoMemoryServer();

      //connect to our in mem mong instance:
      let logger = new Logger("debug");
      const uri = await mongod.getConnectionString();
      songs = new SongDal(logger, uri);

      // populate our in memory database with a dummy song list:
      await songs.populate(__dirname + "\\..\\src\\songs.json");
    });

    after(async () => {
      await mongod.stop();
      await songs.stop();
    });

    it("can search for songs", async () => {
      let res = await songs.getSongSearch("ala");
      expect(res.length).to.equal(1);
      expect(res[0].artist).to.equal("Alanis");
    });

    it("can find a song by id", async () => {
      let res = await songs.getSongById("111");
      expect(res.name).to.equal("Ironic");
      expect(res.artist).to.equal("Alanis");
    });

    it("can delete a song", async () => {
      let song = await songs.getSongById("111");
      expect(song).to.exist;
      let res = await songs.deleteSongById("111");
      expect(res).to.be.true;
      let song1 = await songs.getSongById("111");
      expect(song1).not.to.exist;
    });

    it("can add a song", async () => {
      let res = await songs.addSong(
        "blank song",
        "the busts",
        "http://nourl.com/download/this.mp3",
        300
      );
      expect(res.name).to.equal("blank song");
      expect(res.artist).to.equal("the busts");
    });
  });
});
