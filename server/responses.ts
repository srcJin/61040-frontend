import { User } from "./app";

// import { AlreadyRelatedError, RelationshipNotFoundError, RequestAlreadyExistsError, RequestDoc, RelationshipDoc } from "./concepts/friend";
import { AlreadyRelatedError, RelationshipNotFoundError, RequestAlreadyExistsError, RequestDoc } from "./concepts/relationship";

import { PostAuthorNotMatchError, PostDoc } from "./concepts/post";
import { ProfileDoc } from "./concepts/profile";

import { ObjectId } from "mongodb";
import { ReplyDoc } from "./concepts/reply";
import { Router } from "./framework/router";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await User.getUserById(post.author);
    console.log("responses.ts: author: ", author);
    return { ...post, author: author.username };
  }

  static async convertIdToUsername(id: ObjectId) {
    console.log("convertIdToUsername: id: ", id);
    const user = await User.getUserById(id);
    console.log("responses.ts: user: ", user);
    console.log("responses.ts: user.username: ", user.username);
    return user.username;
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await User.idsToUsernames(posts.map((post) => post.author));
    return posts.map((post, i) => ({ ...post, author: authors[i] }));
  }

  static async reply(reply: ReplyDoc | null) {
    if (!reply) {
      return reply;
    }
    const author = await User.getUserById(reply.author);
    console.log("responses.ts: author: ", author);
    return { ...reply, author: author.username };
  }

  static async replies(replies: ReplyDoc[]) {
    const authors = await User.idsToUsernames(replies.map((reply) => reply.author));
    return replies.map((reply, i) => ({ ...reply, author: authors[i] }));
  }

  /**
   * Convert RequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async friendRequests(requests: RequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await User.idsToUsernames(from.concat(to));
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length] }));
  }

  /**
   * Convert profile into more readable format for the frontend by converting the author id into a username.
   */
  static async profile(profile: ProfileDoc | null) {
    if (!profile) {
      return profile;
    }
    const user = await User.getUserById(profile.user);
    return { ...profile, user: user.username };
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(RequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(RelationshipNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

// Router.registerError(RelationshipDoc, async (e) => {
//   const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
//   return e.formatWith(user1.username, user2.username);
// });

Router.registerError(AlreadyRelatedError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});
