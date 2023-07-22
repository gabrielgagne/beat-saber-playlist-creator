const beatSaberPath = 'C:/Program Files (x86)/Steam/steamapps/common/Beat Saber';
;
export const config = {
  beatSaberPath,
  playlistPath: `${ beatSaberPath }/Playlists`,
  songsPath: `${ beatSaberPath }/Beat Saber_Data/CustomLevels`,
  // get token from https://developer.spotify.com/console/get-available-genre-seeds/
  // somehow only valid for a certain amount of time
  spotifyToken: 'BQDX-tIS--ahH22uOM3bInKWdB3gjVd4chDFWPFcWSHwnxyWukysBRjWwi4EYPoGbbPoPY8ZvSqXPtIvKsWqTULvDBLu-mRuwi-9fIhAMNeiE5PafHJDUaWZRtDnP3boG4gnWr0s_8lL4qpMtn0WGa6fX3XqOq77ftZO9R9AFnFMl3vzR-WX8SkarZmQHkVZDSL2NEJKnS8h1k239aStgolCwgFdbT4aBwA9kiXhpXwzHruowtFZf-htXkBa-5w0SLRdQNIY47P00cQsPZGG'
};