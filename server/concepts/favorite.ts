import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface FavoriteDoc extends BaseDoc {
  user: ObjectId;
  entityIds: ObjectId[]; // the entityIds is the list of favorite items. Each user can have a single favorite list.
}

export default class FavoriteConcept {
  public readonly favorites = new DocCollection<FavoriteDoc>("favorites");

  async addFavorite(user: ObjectId, entityId: ObjectId) {
    const existing = await this.favorites.readOne({ user });

    if (!existing) {
      await this.favorites.createOne({ user, entityIds: [entityId] });
    } else {
      if (existing.entityIds.includes(entityId)) {
        throw new AlreadyFavoritedError(user, entityId);
      } else {
        const updatedEntityIds = [...existing.entityIds, entityId];
        await this.favorites.updateOne({ user }, { entityIds: updatedEntityIds });
      }
    }
    return { msg: "Added to favorites!" };
  }

  async removeFavorite(user: ObjectId, entityId: ObjectId) {
    const existing = await this.favorites.readOne({ user });
    const idToRemove = entityId;

    if (!existing || !existing.entityIds.includes(entityId)) {
      throw new FavoriteNotFoundError(user, entityId);
    }

    if (existing.entityIds.length === 1) {
      // If there's only one entityId left, remove the entire document
      await this.favorites.deleteOne({ user });
    } else {
      // filter out the entityId from the list, and create a new entityIds list
      const updatedEntityIds = existing.entityIds.filter((id) => id.toString() != entityId.toString());
      await this.favorites.updateOne({ user }, { entityIds: updatedEntityIds });
    }

    return { msg: "Removed from favorites!", id: idToRemove };
  }

  async getFavorites(user: ObjectId) {
    const favorites = await this.favorites.readOne({ user });
    console.log("getFavorites", favorites);
    return favorites ? favorites.entityIds : [];
  }

  async isFavorite(user: ObjectId, entityId: ObjectId): Promise<boolean> {
    const existing = await this.favorites.readOne({ user });
    if (!existing) {
      return false;
    }
    return existing.entityIds.includes(entityId);
  }
}

export class AlreadyFavoritedError extends NotAllowedError {
  constructor(
    public readonly user: ObjectId,
    public readonly entityId: ObjectId,
  ) {
    super("Entity {1} is already in the favorites of user {0}!", user, entityId);
  }
}

export class FavoriteNotFoundError extends NotFoundError {
  constructor(
    public readonly user: ObjectId,
    public readonly entityId: ObjectId,
  ) {
    super("Entity {1} by user {0} does not exist in favorites!", user, entityId);
  }
}
