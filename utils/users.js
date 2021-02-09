const users = [];

//join users to chat
function joinUsers(id, username, room) {
  const user = { id, username, room };

  users.push(user);
  return user;
}

//Get current user
function getUser(id) {
  return users.find((user) => user.id === id);
}

//User leaves chat (treba ga izbacit iz liste)
function userLeaves(id) {
  const index = users.findIndex((user) => user.id === id);

  //ako ne pronade usera vrati -1
  if (index !== -1) {
    //maknemo 1 usera koji ima taj index i vratimo ga
    return users.splice(index, 1)[0];
  }
}

//get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  joinUsers,
  getUser,
  userLeaves,
  getRoomUsers,
};
