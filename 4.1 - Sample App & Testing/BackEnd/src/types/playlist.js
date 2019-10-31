"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Playlist {
    constructor(lname, lcreatorId) {
        let list = {
            id: "",
            name: lname,
            songIds: [],
            creationTime: new Date(),
            lastModifiedTime: new Date(),
            creatorId: lcreatorId,
            isPublic: false,
            playedCounter: 0,
        };
        return list;
    }
}
exports.Playlist = Playlist;
//# sourceMappingURL=playlist.js.map