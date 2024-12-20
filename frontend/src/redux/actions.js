import {
  FETCH_ROOMS,
  FETCH_ROOMS_FAILURE,
  FETCH_ROOMS_SUCCESS,
  UPDATE_ROOM_AVAILABILITY
} from "./constants";

export const fetchRooms = () => ({
    type: FETCH_ROOMS,
});

export const fetchRoomsSuccess = (rooms) => ({
    type: FETCH_ROOMS_SUCCESS,
    payload: rooms,
});

export const fetchRoomsFailure = (error) => ({
    type: FETCH_ROOMS_FAILURE,
    payload: error,
});

export const updateRoomAvailability = (roomId, date, availability) => ({
    type: UPDATE_ROOM_AVAILABILITY,
    payload: { roomId, date, availability },
});
  