function getMyDetails() {
  console.log("getMyDetails");
  return $.ajax({
    url: "/users/me",
  });
}

function logOut() {
  return $.ajax({
    method: "POST",
    url: "/users/logout",
  })
}

function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/users/login",
    data
  });
}

function signUp(data) {
  return $.ajax({
    method: "POST",
    url: "/users",
    data
  });
}

function getAllListings(params) {
  let url = "/api/properties";
  if (params) {
    url += "?" + params;
  }
  return $.ajax({
    url,
  });
}

function getFulfilledReservations() {
  console.log("5");
  let url = "/api/reservations";
  return $.ajax({
    url,
  });
}

const submitProperty = function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/properties",
    data,
  });
}
const submitReservation = function(data) {
  console.log("4");
  console.log("submitreser")
  return $.ajax({
    method: "POST",
    url: "/api/reservations",
    data,
  })
}

function getUpcomingReservations() {
  console.log("3");
  let url = '/api/reservations/upcoming';
  return $.ajax({
    url,
  });
}

function getIndividualReservation(reservationId) {
  console.log("2");
  let url = `/api/reservations/${reservationId}`
  return $.ajax({
    url,
  })
}

// const updateReservation = function(data) {
//   console.log("1", data.reservation_id);
  
//   return $.ajax({
//     method: "POST",
//     url:`/api/reservations/${data.reservation_id}`,
//     data,
//   });
// }

const updateReservation = function(data) {
  return $.ajax({
    method: "POST",
    url: `/api/reservations/${data.reservation_id}`,
    data,
  })
}

const deleteReservation = function(data) {
  return $.ajax({
    method: "DELETE",
    url: `/api/reservations/${data.reservation_id}`
  });
}