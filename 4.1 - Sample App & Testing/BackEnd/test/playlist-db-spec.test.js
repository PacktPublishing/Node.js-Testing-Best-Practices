"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dal_playlists_1 = require("../src/dal/dal-playlists");
const dal_songs_1 = require("../src/dal/dal-songs");
const chai = require("chai");
const logger_1 = require("../src/logger");
const mongodb_memory_server_1 = require("mongodb-memory-server");
// const sinon = require("sinon");
// const chaiSinon = require("chai-sinon");
describe("Backend Server Data Access", () => {
    describe("Playlist Data Access", () => {
        it("returns a playlist for an existing listId", () => {
            let db = new dal_playlists_1.PlaylistDal();
            let myTestListId = db.addNewPlaylist("testlist1", "333");
            let plist = db.getPlaylistById(myTestListId);
            chai.expect(plist, "no list was returned").to.not.be.undefined;
            chai
                .expect(plist.name, "retrieved list has wrong name")
                .to.equal("testlist1");
            db.delPlaylist("2", myTestListId);
        });
        it("returns list results for user", () => {
            let db = new dal_playlists_1.PlaylistDal();
            let myTestListId = db.addNewPlaylist("testlist1", "333");
            let myTestListId1 = db.addNewPlaylist("testlist2", "333");
            let plists = db.getPlaylistsByUser("333", true);
            chai
                .expect(plists.length)
                .to.equal(2, "our test user should have 2 lists");
            db.delPlaylist("2", myTestListId);
            db.delPlaylist("2", myTestListId1);
        });
        it("adds a Playlist", () => {
            let db = new dal_playlists_1.PlaylistDal();
            let myTestListId = db.addNewPlaylist("testlist1", "2");
            chai.expect(db.getPlaylistById(myTestListId)).to.not.be.undefined;
            db.delPlaylist("2", myTestListId);
        });
        it("adds an item to list", () => {
            let db = new dal_playlists_1.PlaylistDal();
            let myTestListId = db.addNewPlaylist("testlist1", "2");
            db.addItemToPlaylist("2", myTestListId, "23");
            let playlist = db.getPlaylistById(myTestListId);
            chai
                .expect(playlist.songIds)
                .to.contain("23", "item isn't in playlist after adding it");
            db.delPlaylist("2", myTestListId);
        });
        it("deletes a list item", () => {
            let db = new dal_playlists_1.PlaylistDal();
            let myTestListId = db.addNewPlaylist("testlist1", "2");
            db.addItemToPlaylist("2", myTestListId, "23");
            db.removeItemFromPlaylist("2", myTestListId, "23");
            let playlist = db.getPlaylistById(myTestListId);
            chai
                .expect(playlist.songIds)
                .to.not.contain("23", "item exists in list after deletion");
            db.delPlaylist("2", myTestListId);
        });
        it("deletes a Playlist", () => {
            let db = new dal_playlists_1.PlaylistDal();
            let myTestListId = db.addNewPlaylist("testlist1", "2");
            db.delPlaylist("2", myTestListId);
            chai.expect(db.getPlaylistById(myTestListId), "deletion did not succeed")
                .to.be.undefined;
        });
    });
    describe("Songs Data Access", async () => {
        let songs;
        let mongod;
        before(async () => {
            // create an in memory mongo instance just for testing:
            mongod = new mongodb_memory_server_1.MongoMemoryServer();
            //connect to our in mem mong instance:
            let logger = new logger_1.Logger("debug");
            const uri = await mongod.getConnectionString();
            songs = new dal_songs_1.SongDal(logger, uri);
            // populate our in memory database with a dummy song list:
            await songs.populate(__dirname + "\\..\\src\\songs.json");
        });
        after(async () => {
            await mongod.stop();
            await songs.stop();
        });
        it("can search for songs", async () => {
            let res = await songs.getSongSearch("ala");
            chai.expect(res.length).to.equal(1);
            chai.expect(res[0].artist).to.equal("Alanis");
        });
        it("can find a song by id", async () => {
            let res = await songs.getSongById("111");
            chai.expect(res.name).to.equal("Ironic");
            chai.expect(res.artist).to.equal("Alanis");
        });
        it("can delete a song", async () => {
            let song = await songs.getSongById("111");
            chai.expect(song).to.exist;
            let res = await songs.deleteSongById("111");
            chai.expect(res).to.be.true;
            let song1 = await songs.getSongById("111");
            chai.expect(song1).not.to.exist;
        });
        it("can add a song", async () => {
            let res = await songs.addSong("blank song", "the busts", "http://nourl.com/download/this.mp3", 300);
            chai.expect(res.name).to.equal("blank song");
            chai.expect(res.artist).to.equal("the busts");
        });
    });
});
//# sourceMappingURL=playlist-db-spec.test.js.map