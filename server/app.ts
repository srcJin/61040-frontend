import FavoriteConcept from "./concepts/favorite";
import FriendConcept from "./concepts/friend";
import LikeConcept from "./concepts/like";
import MapConcept from "./concepts/map";
import MarkerConcept from "./concepts/marker";
import PostConcept from "./concepts/post";
import ProfileConcept from "./concepts/profile";
import RelationshipConcept from "./concepts/relationship";
import ReplyConcept from "./concepts/reply";
import TagConcept from "./concepts/tag";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Like = new LikeConcept();
export const Tag = new TagConcept();
export const Profile = new ProfileConcept();
export const Reply = new ReplyConcept();
export const Map = new MapConcept();
export const Relationship = new RelationshipConcept();
export const Favorite = new FavoriteConcept();
export const Marker = new MarkerConcept();
