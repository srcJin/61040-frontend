import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Friend, Like, Post, Profile, User, WebSession } from "./app";
import { PostDoc, PostFilter, PostOptions, PostType } from "./concepts/post";
import { ProfileDoc } from "./concepts/profile";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
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
  async getPosts(author?: string, title?: string) {
    const filter: PostFilter = {};

    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      filter.authorId = id;
    }

    if (title) {
      filter.title = title;
    }

    const posts = await Post.getPosts(filter);

    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, title: string, content: string, visibility: string, type?: PostType, options?: PostOptions) {
    const author = WebSession.getUser(session);
    const created = await Post.create(author, title, content, type || "article", options);
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

  // Like[Post] routes

  // Like a post
  @Router.post("/likes/post/:_id")
  async addPostLike(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Like.addLike(user, "post", _id);
  }

  // Unlike a post
  @Router.delete("/likes/post/:_id")
  async removePostLike(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Like.removeLike(user, "post", _id);
  }

  // Like a reply
  @Router.post("/likes/reply/:_id")
  async addReplyLike(session: WebSessionDoc, _id: ObjectId, replyId: ObjectId) {
    const user = WebSession.getUser(session);
    return await Like.addLike(user, "reply", replyId);
  }

  // Unlike a reply
  @Router.delete("/likes/reply/:_id")
  async removeReplyLike(session: WebSessionDoc, _id: ObjectId, replyId: ObjectId) {
    const user = WebSession.getUser(session);
    return await Like.removeLike(user, "reply", replyId);
  }

  // Get all likes for a user
  @Router.get("/likes")
  async getAllLikes(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const likedPosts = await Like.getUserLikes(user, "post");
    const likedReplies = await Like.getUserLikes(user, "reply");
    return { likedPosts, likedReplies };
  }

  // Get the like count for a post
  @Router.get("/likes/post/:id/like-count")
  async getPostLikeCount(_id: ObjectId) {
    return { count: await Like.getLikeCount("post", _id) };
  }

  // Get the like count for a reply
  @Router.get("/likes/reply/:id/like-count")
  async getReplyLikeCount(_id: ObjectId) {
    return { count: await Like.getLikeCount("reply", _id) };
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }
}

export default getExpressRouter(new Routes());
