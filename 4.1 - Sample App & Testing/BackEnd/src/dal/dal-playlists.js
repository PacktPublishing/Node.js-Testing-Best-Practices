"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playlist_1 = require("../types/playlist");
const uuidv4 = require("uuid/v4");
class PlaylistDal {
    constructor() {
        this.map = new Map();
        this.populate();
    }
    populate() {
        this.map["1"] = {
            id: "1",
            name: "PopHits2000",
            songIds: ["111"],
            creationTime: Date.parse("21-07-2011T11:48:33"),
            lastModifiedTime: Date.parse("21-07-2011T11:48:33"),
            creatorId: "102239082092063283638",
            isPublic: true,
            playedCounter: 21
        };
        this.map["2"] = {
            id: "2",
            name: "User1-Hits2001",
            songIds: [],
            creationTime: Date.parse("21-07-2011T11:48:33"),
            lastModifiedTime: Date.parse("21-07-2011T11:48:33"),
            creatorId: "1",
            isPublic: false,
            playedCounter: 21
        };
        this.map["3"] = {
            id: "3",
            name: "User2-Hits2002",
            songIds: [],
            creationTime: Date.parse("21-07-2011T11:48:33"),
            lastModifiedTime: Date.parse("21-07-2011T11:48:33"),
            creatorId: "2",
            isPublic: false,
            playedCounter: 21
        };
    }
    getPlaylistById(id) {
        return this.map[id];
    }
    getPlaylistsByUser(uid, onlyOwned) {
        let retList = [];
        for (let key in this.map) {
            let plist = this.map[key];
            if (plist.creatorId === uid || (plist.isPublic && !onlyOwned)) {
                retList.push(plist);
            }
        }
        return retList;
    }
    addNewPlaylist(listName, creatorId) {
        let listItem = new playlist_1.Playlist(listName, creatorId);
        let newListId = uuidv4(); //"" + (this.count() + 1);
        listItem.id = newListId;
        listItem.songIds = [];
        this.map[newListId] = listItem;
        return newListId;
    }
    hasAccess(listId, userId) {
        let list = this.map[listId];
        return list.creatorId === userId;
    }
    addItemToPlaylist(currentUserId, listId, songId) {
        if (!this.map[listId]) {
            return new Error("Playlist not found");
        }
        // if (!this.hasAccess(listId, currentUserId)) {
        //     return new Error("User not authorized to change the playlist");
        // }
        this.map[listId].songIds.push(songId);
    }
    removeItemFromPlaylist(currentUserId, listId, songId) {
        if (!this.map[listId]) {
            return new Error("Playlist not found");
        }
        // if (!this.hasAccess(listId, currentUserId)) {
        //     return new Error("User not authorized to change the playlist");
        // }
        let plist = this.map[listId];
        let array = plist.songIds;
        let index = array.indexOf(songId);
        if (index > -1) {
            array.splice(index, 1);
        }
        this.map[listId].songIds = array;
    }
    delPlaylist(currentUserId, listId) {
        if (!this.map[listId]) {
            return new Error("Playlist not found");
        }
        // if (!this.hasAccess(listId, currentUserId)) {
        //     return new Error("User not authorized to change the playlist");
        // }
        delete this.map[listId];
    }
    count() {
        return Object.keys(this.map).length;
    }
}
exports.PlaylistDal = PlaylistDal;
//# sourceMappingURL=dal-playlists.js.map