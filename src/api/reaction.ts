import api from "./config";

export enum ReactionType {
  COMMENT = "comment",
  EMOTICON = "imoticon",
}

export async function postReaction(
  subGoalId: number,
  type: ReactionType,
  content: string
) {
  return await api
    .post(`/sub-goals/${subGoalId}/reactions`, { type, content })
    .then((response) => {
      console.log(response.data);
      return true;
    });
}

export async function updateReaction(
  subGoalId: number,
  reactionId: number,
  type: ReactionType,
  content: string
) {
  await api.put(`/sub-goals/${subGoalId}/reactions/${reactionId}`, {
    type,
    content,
  });
}

export async function deleteReaction(subGoalId: number, reactionId: number) {
  await api.delete(`/sub-goals/${subGoalId}/reactions/${reactionId}`);
}
