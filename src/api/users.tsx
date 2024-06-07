import api from "./config";

export type UserInfo = {
  id: number;
  name: string;
  image: string | null;
  introduction: string | null;
  uid: string;
};

export type FollowInfo = {
  id: number;
  name: string;
  introduction: string;
  image: string;
  uid: string;
};

export async function getUserInfo() {
  const data = await api
    .get("/users/me")
    .then((response: { data: UserInfo }) => {
      return response.data;
    });
  return data;
}

export async function getFollowingInfo(userId: string): Promise<FollowInfo[]> {
  try {
    const response = await api.get(
      `/users/${userId}/follows?kind=followings&status=accepted`
    );
    console.log(response.data, "0");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch followings info:", error);
    return [];
  }
}

export async function getFollowerInfo(userId: string): Promise<FollowInfo[]> {
  try {
    const response = await api.get(
      `/users/${userId}/follows?kind=followers&stat=pending`
    );
    console.log(response.data, "4");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch follower info:", error);
    return [];
  }
}

export async function acceptFollower(userId: string) {
  try {
    const response = await api.put(`/users/${userId}/follows`);
    return response.data;
  } catch (error) {
    console.error(`Failed to accept follower`, error);
    throw error;
  }
}

export async function deleteFollower(followId: number): Promise<void> {
  try {
    await api.delete(`/users/${followId}/follows?kind=followers`);
    console.log(`Follow ${followId} deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete follow ${followId}:`, error);
    throw new Error(`Failed to delete follow ${followId}`);
  }
}
