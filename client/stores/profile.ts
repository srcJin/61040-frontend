import { BodyT, fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";

export const useProfileStore = defineStore(
  "profile",
  () => {
    const getProfileByUsername = async (username: string) => {
      return await fetchy(`api/profile/${username}`, "GET");
    };

    // const createProfileByUsername = async (username: string, nickname: string, email: string, headshotUrl?: string, identity?: string[], role?: string) => {
    //   return await fetchy(`api/profile/${username}`, "POST", {
    //     body: {
    //       nickname,
    //       email,
    //       headshotUrl,
    //       identity,
    //       role,
    //     },
    //   });
    // };

    const updateProfileByUsername = async (username: string, patch: BodyT) => {
      return await fetchy(`api/profile/${username}`, "PATCH", { body: { update: patch } });
    };

    const deleteProfileByUsername = async (username: string) => {
      return await fetchy(`api/profile/${username}`, "DELETE");
    };

    const getUserLocationByUsername = async (username: string) => {
      return await fetchy(`api/profile/${username}/location`, "GET");
    };

    const updateUserLocationByUsername = async (username: string, location: number[]) => {
      return await fetchy(`api/profile/${username}/location`, "PATCH", {
        body: { location },
      });
    };

    return {
      getProfileByUsername,
      createProfileByUsername,
      updateProfileByUsername,
      deleteProfileByUsername,
      getUserLocationByUsername,
      updateUserLocationByUsername,
    };
  },
  { persist: true },
);
