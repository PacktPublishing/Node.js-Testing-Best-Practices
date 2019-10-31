const request = require("request-promise-native");
const chai = require("chai");
const baseUrl = "http://localhost:3002/";
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const cp = require("child_process");
const expect = chai.expect;

describe("Playlist Server Interface", () => {
  describe("playlist API", () => {
    let childProc;
    let mongod;
    before(async () => {
      // create an in memory mongo instance just for testing:
      mongod = new MongoMemoryServer();

      //connect the app to our in mem mongo instance:
      const port = await mongod.getPort();
      const name = await mongod.getDbName();
      process.env["MONGO_SERVICE_HOST"] = "127.0.0.1";
      process.env["MONGO_SERVICE_PORT_TCP"] = "" + port;
      process.env["MONGO_SERVICE_DB_NAME"] = name;

      childProc = cp.exec(
        "node src/app.js",
        { cwd: "../4.1 - Sample App & Testing/BackEnd" },
        (err, stdout, stderr) => {
          if (err) {
            console.error(`exec error: ${err}`);
            return;
          }
        }
      );
      childProc.stdout.on("data", function(data) {
        console.log(data);
      });

      //childProc.stdout.pipe(process.stdout);

      for (let i = 0; i < 10; i++) {
        try {
          let res = await request.get(baseUrl + "v1/playlists?id=2");
          //if the server responds, break out, if not retry up to 10 times...
          break;
        } catch (ex) {}
      }
    });

    after(async () => {
      console.log("killing service: ", childProc.pid);
      childProc.kill("SIGKILL");
      console.log("stopping in mem DB");
      await mongod.stop();
    });

    it("GET playlist by id", async () => {
      let res = await request.get(baseUrl + "v1/playlists?id=2");
      let rObj = JSON.parse(res);
      chai.assert(res, "no response recieved!");
      chai.assert(rObj.length > 0, "no data returned");
      chai.assert(rObj[0].id == 2, "wrong object returned");
    });

    async function createPlaylist() {
      let plist = {
        id: "3",
        name: "stam1",
        songIds: null,
        creationTime: null,
        lastModifiedTime: null,
        creatorId: "me",
        isPublic: true,
        playedCounter: 0
      };
      // let promise = new Promise<string>(function(resolve, reject) {
      return await request.post({
        headers: { "content-type": "application/json" },
        url: baseUrl + "v1/playlists",
        body: JSON.stringify(plist)
      });
    }

    it("adds a playlist", async () => {
      let id = await createPlaylist();
      // id should be a uuid string:
      expect(id.length).to.be.greaterThan(8);
    });

    it("adds a song to playlist (without await)", done => {
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: baseUrl + "v1/playlists/2?songId=3"
        },
        (error, response, body) => {
          chai.assert(response, "no response recieved!");
          chai.assert(response.statusCode === 200, "error in status code");
          request.get(
            baseUrl + "v1/playlists?id=2",
            (error, response, body) => {
              resp = JSON.parse(body);
              expect(resp).to.not.be.undefined;
              expect(resp[0]).to.not.be.undefined;
              expect(resp[0].songIds).to.not.be.undefined;
              let firstSong = resp[0].songIds[0];
              expect(firstSong).to.eq("3");
              request.delete(
                {
                  headers: { "content-type": "application/json" },
                  url: baseUrl + "v1/playlists/2?songId=3"
                },
                () => {
                  done();
                }
              );
            }
          );
        }
      );
    });

    it("adds a song to playlist", async () => {
      await request.post({
        headers: { "content-type": "application/json" },
        url: baseUrl + "v1/playlists/2?songId=3"
      });
      let resp = await request.get(baseUrl + "v1/playlists?id=2");
      resp = JSON.parse(resp);

      expect(resp).to.not.be.undefined;
      expect(resp[0]).to.not.be.undefined;
      expect(resp[0].songIds).to.not.be.undefined;
      let firstSong = resp[0].songIds[0];
      expect(firstSong).to.eq("3");

      await request.delete({
        headers: { "content-type": "application/json" },
        url: baseUrl + "v1/playlists/2?songId=3"
      });
    });

    it("removes a song from playlist", async () => {
      let resCreate = await request.post({
        headers: { "content-type": "application/json" },
        url: baseUrl + "v1/playlists/3?songId=3"
      });
      chai.expect(resCreate).to.eq("success");

      let res = await request.delete({
        headers: { "content-type": "application/json" },
        url: baseUrl + "v1/playlists/3?songId=3"
      });
      chai.expect(res).to.eq("success");
    });

    it("deletes a playlist", async () => {
      let listId = await createPlaylist();
      let res = await request.delete(baseUrl + "v1/playlists?id=" + listId);
      chai.expect(res).to.eq("success");
    });
  });
});
