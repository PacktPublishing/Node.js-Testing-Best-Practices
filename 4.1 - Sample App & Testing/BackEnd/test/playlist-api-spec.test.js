"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const chai = require("chai");
const baseUrl = "http://localhost:3002/";
describe("Playlist Server Interface", () => {
    describe("playlist API", () => {
        it("GET playlist by id", async () => {
            let res = await request.get(baseUrl + "v1/playlists?id=2");
            let rObj = JSON.parse(res);
            chai.assert(res, "no response recieved!");
            chai.assert(rObj.length > 0, "no data returned");
            chai.assert(rObj[0].id == 2, "wrong object returned");
        });
        async function createPlaylist() {
            let plist;
            return await request.post({
                headers: { "content-type": "application/json" },
                url: baseUrl + "v1/playlists",
                body: JSON.stringify(plist)
            });
        }
        it("adds a playlist", async () => {
            let id = await createPlaylist();
            chai.expect(id.length).to.be.greaterThan(8);
        });
        it("adds a song to playlist", async () => {
            await request.post({
                headers: { "content-type": "application/json" },
                url: baseUrl + "v1/playlists/2?songId=3"
            });
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
//# sourceMappingURL=playlist-api-spec.test.js.map