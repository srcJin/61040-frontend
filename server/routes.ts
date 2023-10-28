import { Filter, ObjectId } from "mongodb";
import { Favorite, Like, Map, Marker, Post, Profile, Relationship, Reply, Tag, User, WebSession } from "./app";
import { MapDoc } from "./concepts/map";
import { MarkerDoc, MarkerType } from "./concepts/marker";
import { PostDoc, PostFilter, PostOptions, PostType } from "./concepts/post";
import { ProfileDoc } from "./concepts/profile";
import { RelType } from "./concepts/relationship";
import { ReplyType } from "./concepts/reply";
import { TagDoc } from "./concepts/tag";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { Router, getExpressRouter } from "./framework/router";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  // Profile[User] routes
  // TA ed
  // Syncronized between user and profile
  // Get Profile by Username
  @Router.get("/profile/:username")
  async getProfile(username: string) {
    const user = await User.getUserByUsername(username);
    // console.log("id=", user._id);
    return await Profile.getByUser(user._id);
  }

  // Create Profile for a User by Username
  @Router.post("/profile/:username")
  async createProfileByUsername(username: string, nickname: string, email: string, headshotUrl?: string, identity?: string[], role?: string) {
    const id = (await User.getUserByUsername(username))._id;
    const created = await Profile.create(id, nickname, email, headshotUrl, identity, role);
    return { msg: created.msg, profile: await created.profile };
  }

  // Update Profile of a User by Username
  @Router.patch("/profile/:username")
  async updateProfileByUsername(username: string, update: Partial<ProfileDoc>) {
    const user = (await User.getUserByUsername(username))._id;
    // await Profile.isUser(id, id); // Verifying if the profile belongs to the user
    return await Profile.update(user, update);
  }

  // Delete Profile of a User by Username
  @Router.delete("/profile/:username")
  async deleteProfileByUsername(username: string) {
    const user = (await User.getUserByUsername(username))._id;
    return Profile.delete(user);
  }

  // Get User Location by Username
  @Router.get("/profile/:username/location")
  async getUserLocationByUsername(username: string) {
    const user = await User.getUserByUsername(username); // Assuming you have a method to get user by username
    return { location: await Profile.getUserLocation(user._id) };
  }

  // Update User Location
  @Router.patch("/profile/:username/location")
  async updateUserLocationByUsername(username: string, location: number[]) {
    const user = await User.getUserByUsername(username);
    return await Profile.updateLocation(user._id, location);
  }

  // Posts routes

  @Router.get("/posts")
  // get posts can search by author, title, timeframe and tags
  // now it has many ifs, will try to make it more modularized
  async getPosts(author?: string, title?: string, postType?: PostType) {
    const filter: PostFilter = {};

    if (author) {
      // TODO why author adds a ?
      const username = (await User.getUserByUsername(author))._id;
      // console.log("routes getPosts username=", username);
      filter.author = username;
    }

    if (title) {
      filter.title = title;
    }

    if (postType) {
      filter.postType = postType;
    }

    const posts = await Post.getPosts(filter);
    // console.log("filter=", filter);
    // console.log("routes getPosts posts=", posts);
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, title: string, content: string, postType?: PostType, options?: PostOptions) {
    const author = WebSession.getUser(session);
    const created = await Post.create(author, title, content, postType, options);
    console.log("created=", created);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  // @Router.get("/friends")
  // async getFriends(session: WebSessionDoc) {
  //   const user = WebSession.getUser(session);
  //   return await User.idsToUsernames(await Friend.getFriends(user));
  // }

  // @Router.delete("/friends/:friend")
  // async removeFriend(session: WebSessionDoc, friend: string) {
  //   const user = WebSession.getUser(session);
  //   const friendId = (await User.getUserByUsername(friend))._id;
  //   return await Friend.removeFriend(user, friendId);
  // }

  // @Router.get("/friend/requests")
  // async getRequests(session: WebSessionDoc) {
  //   const user = WebSession.getUser(session);
  //   return await Responses.friendRequests(await Friend.getRequests(user));
  // }

  // @Router.post("/friend/requests/:to")
  // async sendFriendRequest(session: WebSessionDoc, to: string) {
  //   const user = WebSession.getUser(session);
  //   const toId = (await User.getUserByUsername(to))._id;
  //   return await Friend.sendRequest(user, toId);
  // }

  // @Router.delete("/friend/requests/:to")
  // async removeFriendRequest(session: WebSessionDoc, to: string) {
  //   const user = WebSession.getUser(session);
  //   const toId = (await User.getUserByUsername(to))._id;
  //   return await Friend.removeRequest(user, toId);
  // }

  // @Router.put("/friend/accept/:from")
  // async acceptFriendRequest(session: WebSessionDoc, from: string) {
  //   const user = WebSession.getUser(session);
  //   const fromId = (await User.getUserByUsername(from))._id;
  //   return await Friend.acceptRequest(fromId, user);
  // }

  // @Router.put("/friend/reject/:from")
  // async rejectFriendRequest(session: WebSessionDoc, from: string) {
  //   const user = WebSession.getUser(session);
  //   const fromId = (await User.getUserByUsername(from))._id;
  //   return await Friend.rejectRequest(fromId, user);
  // }

  // Reply[Post] routes

  @Router.get("/replies/:_postId")
  async getRepliesByPostId(_postId: ObjectId) {
    console.log("getRepliesByPostId, relatedPost=", _postId);
    return await Reply.getRepliesByPostId(_postId);
  }

  @Router.post("/replies/:_postId")
  async createReply(session: WebSessionDoc, content: string, replyType: ReplyType, _postId: ObjectId) {
    console.log("createReply, relatedPost=", _postId);
    const author = WebSession.getUser(session);
    const created = await Reply.create(author, content, replyType || "comment", _postId);
    return { msg: created.msg, reply: created.reply };
  }

  @Router.patch("/replies/:_postId/:_replyId") // here :id is the post id, :replyId is the reply id
  async updateReply(session: WebSessionDoc, _postId: ObjectId, _replyId: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Reply.isAuthor(user, _replyId);
    return await Reply.update(_replyId, update);
  }

  @Router.delete("/replies/:_postId/:_replyId")
  async deleteReply(session: WebSessionDoc, _postId: ObjectId, _replyId: ObjectId) {
    const user = WebSession.getUser(session);
    await Reply.isAuthor(user, _replyId);
    return Reply.delete(_replyId);
  }

  // follow target user
  // follow target user
  @Router.post("/relationships/follow/:user2")
  async follow(session: WebSessionDoc, user2: string) {
    console.log("follow user2=", user2);
    const user1Id = WebSession.getUser(session);
    const user2Id = await User.getUserByUsername(user2);
    await Relationship.follow(user1Id, user2Id._id);
    return { success: true, message: "Followed successfully" };
  }

  @Router.get("/relationships/")
  async getRelationships(session: WebSessionDoc) {
    // You can pass type as a query parameter
    const user = WebSession.getUser(session);
    const relationships = await Relationship.getRelationships(user);
    // Convert each userId in relationships to username
    const usernames = await Promise.all(
      relationships.map(async (userId: ObjectId) => {
        console.log("getRelationships", Responses.convertIdToUsername(userId));
        return Responses.convertIdToUsername(userId);
      }),
    );

    return { msg: "Following users:", list: usernames };
  }

  @Router.delete("/relationships/:user2/:relType")
  async removeRelationship(session: WebSessionDoc, user2: string, relType: RelType) {
    const user1Id = WebSession.getUser(session);
    const user2Id = (await User.getUserByUsername(user2))._id;
    return await Relationship.removeRelationship(user1Id, user2Id, relType);
  }

  @Router.get("/relationships/requests/:relType")
  async getRequests(session: WebSessionDoc, relType: RelType) {
    const user = WebSession.getUser(session);
    const requests = await Relationship.getRequests(user, relType);
    return {
      requests,
    };
  }

  @Router.post("/relationships/requests/:to/:relType")
  async sendRequest(session: WebSessionDoc, to: string, relType: RelType) {
    // relType can be passed as a query parameter
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Relationship.sendRequest(user, toId, relType);
  }

  @Router.delete("/relationships/requests/:to/:relType")
  async removeRequest(session: WebSessionDoc, to: string, relType: RelType) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Relationship.removeRequest(user, toId, relType);
  }

  @Router.put("/relationships/accept/:from/:relType")
  async acceptRequest(session: WebSessionDoc, from: string, relType: RelType) {
    // relType can be passed as a query parameter
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Relationship.acceptRequest(fromId, user, relType);
  }

  @Router.put("/relationships/reject/:from/:relType")
  async rejectRequest(session: WebSessionDoc, from: string, relType: RelType) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Relationship.rejectRequest(fromId, user, relType);
  }

  // Map routes
  // Map concept is different, need ask TA
  // we are using an API to draw an app at the front end
  // So the data the backend should provide is what the API need
  // functions, like zoom, will only rely on frontend
  // will need to check the API (probably leaflet) to better understand this part.

  // Map routes
  @Router.post("/map")
  async createMap(session?: WebSessionDoc, initialState?: Partial<MapDoc>) {
    const userId = session ? WebSession.getUser(session) : undefined;

    // If the session has a userId, set it to the initialState
    if (userId) {
      initialState = { ...initialState, user: userId };
    }

    // Use the createMap function
    await Map.createMap(initialState);
    return { msg: "Map successfully created!" };
  }

  @Router.get("/map/state")
  async getMapState(session?: WebSessionDoc) {
    const userId = session ? WebSession.getUser(session) : undefined;
    return await Map.getMapByUser(userId);
  }

  @Router.patch("/map/centerpoint")
  async setCenterPoint(lng: number, lat: number, session?: WebSessionDoc) {
    const userId = session ? WebSession.getUser(session) : undefined;
    await Map.setCenterPoint([lng, lat], userId);
    return { msg: "Center point updated!" };
  }

  @Router.patch("/map/zoomlevel")
  async setZoomLevel(zoom: number, session?: WebSessionDoc) {
    const userId = session ? WebSession.getUser(session) : undefined;
    await Map.setZoomLevel(zoom, userId);
    return { msg: "Zoom level updated!" };
  }

  @Router.post("/map/layer")
  async addLayer(layer: string, session?: WebSessionDoc) {
    const userId = session ? WebSession.getUser(session) : undefined;
    await Map.addLayer(layer, userId);
    return { msg: "Layer added!" };
  }

  @Router.delete("/map/layer")
  async removeLayer(layer: string, session?: WebSessionDoc) {
    const userId = session ? WebSession.getUser(session) : undefined;
    await Map.removeLayer(layer, userId);
    return { msg: "Layer removed!" };
  }

  @Router.patch("/map/theme")
  async setTheme(theme: string, session?: WebSessionDoc) {
    const userId = session ? WebSession.getUser(session) : undefined;
    await Map.setTheme(theme, userId);
    return { msg: "Map theme updated!" };
  }

  @Router.post("/markers")
  // Create a marker
  async createMarker(session: WebSessionDoc, location: [number, number], itemId: ObjectId, type: MarkerType, info?: string, postIds?: ObjectId[]) {
    // const user = WebSession.getUser(session);
    // if used user, we need some authorization checks here depending on your requirements
    // @TODO, ask TA
    const created = await Marker.create(location, itemId, type, info, postIds);
    return { msg: created.msg, marker: created.marker };
  }

  // Marker[Map] routes
  @Router.get("/markers") //
  // Retrieve markers with optional filtering by location and zoom level
  async getMarkers(session: WebSessionDoc, itemId?: ObjectId, type?: MarkerType, location?: [number, number], zoomLevel?: number): Promise<{ markers: MarkerDoc[] }> {
    let markers: MarkerDoc[] = [];

    const filter: Filter<MarkerDoc> = {};

    // If provide itemId , add it to the filter
    if (itemId) {
      filter.itemId = itemId;
    }
    // If provide type, add it to the filter
    if (type) {
      filter.type = type;
    }
    // If provide location and zoomLevel, filter markers in range
    // notice: filtering by range happens before applying the filter
    if (location && zoomLevel) {
      markers = await Marker.getMarkersInRange(location, zoomLevel, filter);
    } else {
      // Otherwise, retrieve markers based on the filter
      markers = await Marker.getMarkers(filter);
    }

    return { markers };
  }

  @Router.patch("/markers/:_id")
  // Update an existing marker
  async updateMarker(session: WebSessionDoc, _id: ObjectId, update: Partial<MarkerDoc>) {
    // const user = WebSession.getUser(session);
    // no need for check if the user is the author of the marker
    // the operation will happen backend
    const updated = await Marker.update(_id, update);
    return { msg: updated.msg, marker: updated.marker };
  }

  @Router.delete("/markers/:_id")
  // Delete an existing marker
  async deleteMarker(session: WebSessionDoc, _id: ObjectId) {
    // const user = WebSession.getUser(session);
    // Add authorization checks if needed
    const deleted = await Marker.delete(_id);
    return { msg: deleted.msg, marker: deleted.marker };
  }

  // Favorite[Item] routes

  // Add a post to the favorite list
  // Add an item (post/reply/etc.) to the favorite list
  @Router.post("/favorites/:_id")
  async addItemToFavorites(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Favorite.addFavorite(user, _id);
  }

  // Remove an item (post/reply/etc.) from favorites
  @Router.delete("/favorites/:_id")
  async removeItemFromFavorites(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Favorite.removeFavorite(user, _id);
  }

  // Get all favorites for a user
  @Router.get("/favorites")
  async getAllFavorites(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const favorites = await Favorite.getFavorites(user);
    return { favorites };
  }

  // Check if an item (post/reply/etc.) is in the favorites list
  @Router.get("/favorites/isFavorite/:_id")
  async isFavorite(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Favorite.isFavorite(user, _id);
  }

  // Like[Post] routes

  // Like a post
  @Router.post("/likes/:_id")
  async addLike(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Like.addLike(user, _id);
  }

  // Unlike a post
  @Router.delete("/likes/:_id")
  async removeLike(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Like.removeLike(user, _id);
  }

  // Get all likes for a user
  @Router.get("/likes")
  async getAllLikes(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const liked = await Like.getUserLikes(user);
    return { liked };
  }

  // Get the like count for a post
  @Router.get("/likes/:_id/like-count")
  async getLikeCount(_id: ObjectId) {
    return { count: await Like.getLikeCount(_id) };
  }

  // Tags routes

  @Router.get("/tags")
  async getAllTags(query?: Filter<TagDoc>) {
    return await Tag.getAllTags(query);
  }

  @Router.post("/tags")
  async createTag(name: string) {
    return await Tag.createTag(name);
  }

  @Router.patch("/tags/:tagId")
  async updateTag(tagId: ObjectId, update: Partial<TagDoc>) {
    return await Tag.updateTag(tagId, update);
  }

  @Router.delete("/tags/:tagId")
  async deleteTag(tagId: ObjectId) {
    return await Tag.deleteTag(tagId);
  }

  @Router.get("/tags/:tagId/items")
  async getItemsByTagId(tagId: ObjectId) {
    return await Tag.getTagsByItemId(tagId);
  }

  @Router.get("/tags/:itemId/tags")
  async getTagsByItemId(itemID: ObjectId) {
    return await Tag.getItemsByTagId(itemID);
  }

  @Router.post("/tags/:tagId/items/:itemId")
  async assignTagToItem(tagId: ObjectId, itemId: ObjectId) {
    return await Tag.assignTagToItem(tagId, itemId);
  }
}

export default getExpressRouter(new Routes());
