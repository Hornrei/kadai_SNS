import { config } from "../config";

export async function  favoriteHandler(id, isFav){
  if (isFav) {
    await unfavoritePost(id).then((res) => {
      return res;
    });
  } else {
    await favoritePost(id).then((res) => {
      return res;
    });
  }
};


export async function favoritePost (id) {
  const respons = await fetch(`${config.apiUrl}/api/v1/post/favorite`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify({
      post_id: id,
    }),
  }).then((res) => res.json());
  if (respons.status == "ok") {
    return {state: true, isFav: true};
  }
  return {state: false, isFav: true};
};

export async function unfavoritePost (id) {
  const respons = await fetch(`${config.apiUrl}/api/v1/post/unfavorite`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify({
      post_id: id,
    }),
  }).then((res) => res.json());
  if (respons.status == "ok") {
    return {state: true, isFav: false};
  }
  return {state: false, isFav: true};
};
