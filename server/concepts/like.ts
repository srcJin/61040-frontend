import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface LikeDoc extends BaseDoc {
  user: ObjectId;
  entityId: ObjectId; // the entityId of the item being liked
}

export default class LikeConcept {
  public readonly likes = new DocCollection<LikeDoc>("likes");

  async addLike(user: ObjectId, entityId: ObjectId) {
    const existing = await this.likes.readOne({ user, entityId });

    if (existing) {
      throw new AlreadyLikedError(user, entityId);
    } else {
      await this.likes.createOne({ user, entityId });
    }
    return { msg: "Liked!" };
  }

  async removeLike(user: ObjectId, entityId: ObjectId) {
    const existing = await this.likes.readOne({ user, entityId });

    if (!existing) {
      throw new LikeNotFoundError(user, entityId);
    } else {
      await this.likes.deleteOne({ user, entityId });
    }
    return { msg: "Like removed!" };
  }

  async getUserLikes(user: ObjectId) {
    const likes = await this.likes.readMany({ user });
    return likes.map((like) => like.entityId);
  }

  async getLikeCount(entityId: ObjectId) {
    const likes = await this.likes.readMany({ entityId });
    return likes.length;
  }
}

export class AlreadyLikedError extends NotAllowedError {
  constructor(
    public readonly user: ObjectId,
    public readonly entityId: ObjectId,
  ) {
    super("Entity {1} is already liked by user {0}!", user, entityId);
  }
}

export class LikeNotFoundError extends NotFoundError {
  constructor(
    public readonly user: ObjectId,
    public readonly entityId: ObjectId,
  ) {
    super("Entity {1} by user {0} does not exist in likes!", user, entityId);
  }
}
