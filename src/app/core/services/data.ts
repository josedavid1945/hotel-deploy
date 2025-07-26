import { Injectable, inject } from '@angular/core';
import { Firestore,getDoc, addDoc, collection, collectionData,deleteDoc,doc,updateDoc, where,query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';

// Definimos una interfaz para el objeto Habitación para tener un código más limpio

export interface Room {
  id?: string;
  name: string;
  guestCapacity: number; // Corregido: 'guestcapacity' a 'guestCapacity'
  price: number;
  description: string;
  quantity: number;
  imageUrl?: string;
}
export interface Hall {
  id?: string;
  name: string;
  capacity: number;
  price: number;
  equipment: string;
  imageUrl?: string;
}
export interface HotelEvent {
  id?: string;
  name: string;
  date: string;
  description: string;
  price?: number;
  capacity?: number;
  imageUrl?: string;
}
export interface EventReservation {
  id?: string;
  eventId: string;
  eventName: string;
  userId: string;
  userEmail: string;
  tickets: number;
  totalPrice: number;
  reservationDate: Date;
}
export interface RoomReservation {
  id?: string;
  roomId: string;
  roomName: string;
  userId: string;
  userEmail: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  reservationDate: Date;
}
export interface HallReservation {
  id?: string;
  hallId: string;
  hallName: string;
  userId: string;
  userEmail: string;
  eventDate: Date;
  reservationDate: Date;
}
  export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: 'client' | 'admin';
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore: Firestore = inject(Firestore);

  private zone = inject(NgZone);  // Obtener todas las habitaciones como un Observable (se actualiza en tiempo real)
  getRooms(): Observable<Room[]> {
    const roomsCollection = collection(this.firestore, 'rooms');
    return collectionData(roomsCollection, { idField: 'id' }) as Observable<Room[]>;
  }

  // Añadir una nueva habitación a la base de datos
  addRoom(room: Room) {
    const roomsCollection = collection(this.firestore, 'rooms');
    return addDoc(roomsCollection, room);
  }
  deleteRoom(roomId: string) {
    const roomDocRef = doc(this.firestore, `rooms/${roomId}`);
    return deleteDoc(roomDocRef);
  }
  updateRoom(roomId: string, roomData: any) {
    const roomDocRef = doc(this.firestore, `rooms/${roomId}`);
    return updateDoc(roomDocRef, roomData);
  }
  
  getHalls(): Observable<Hall[]> {
    const hallsCollection = collection(this.firestore, 'halls');
    return collectionData(hallsCollection, { idField: 'id' }) as Observable<Hall[]>;
  }

  addHall(hall: Hall) {
    const hallsCollection = collection(this.firestore, 'halls');
    return addDoc(hallsCollection, hall);
  }
  
  updateHall(hallId: string, hallData: any) {
    const hallDocRef = doc(this.firestore, `halls/${hallId}`);
    return updateDoc(hallDocRef, hallData);
  }

  deleteHall(hallId: string) {
    const hallDocRef = doc(this.firestore, `halls/${hallId}`);
    return deleteDoc(hallDocRef);
  }
  getEvents(): Observable<HotelEvent[]> {
    const eventsCollection = collection(this.firestore, 'events');
    return collectionData(eventsCollection, { idField: 'id' }) as Observable<HotelEvent[]>;
  }

  addEvent(event: HotelEvent) {
    const eventsCollection = collection(this.firestore, 'events');
    return addDoc(eventsCollection, event);
  }
  
  updateEvent(eventId: string, eventData: any) {
    const eventDocRef = doc(this.firestore, `events/${eventId}`);
    return updateDoc(eventDocRef, eventData);
  }

  deleteEvent(eventId: string) {
    const eventDocRef = doc(this.firestore, `events/${eventId}`);
    return deleteDoc(eventDocRef);
  }
  addEventReservation(reservation: Omit<EventReservation, 'id'>) {
    const reservationsCollection = collection(this.firestore, 'eventReservations');
    return addDoc(reservationsCollection, reservation);
  }
  getEventReservationsForUser(userId: string): Observable<EventReservation[]> {
    const reservationsCollection = collection(this.firestore, 'eventReservations');
    // Creamos una consulta para filtrar las reservas por el ID del usuario
    const q = query(reservationsCollection, where("userId", "==", userId));
    return collectionData(q, { idField: 'id' }) as Observable<EventReservation[]>;
  }
  getRoomById(roomId: string) {
    const roomDocRef = doc(this.firestore, `rooms/${roomId}`);
    return getDoc(roomDocRef);
  }
  getUserById(userId: string){
    const idDocRef = doc(this.firestore, `users/${userId}`);
    return getDoc(idDocRef);
  }
  // Añadir una nueva reserva de habitación
  addRoomReservation(reservation: Omit<RoomReservation, 'id'>) {
    const reservationsCollection = collection(this.firestore, 'roomReservations');
    return addDoc(reservationsCollection, reservation);
  }
  getRoomReservationsForUser(userId: string): Observable<RoomReservation[]> {
    const reservationsCollection = collection(this.firestore, 'roomReservations');
    const q = query(reservationsCollection, where("userId", "==", userId));
    return collectionData(q, { idField: 'id' }) as Observable<RoomReservation[]>;
  }
  getAllRoomReservations(): Observable<RoomReservation[]> {
    const reservationsCollection = collection(this.firestore, 'roomReservations');
    return collectionData(reservationsCollection, { idField: 'id' }) as Observable<RoomReservation[]>;
  }

  // Obtener TODAS las reservas de eventos
  getAllEventReservations(): Observable<EventReservation[]> {
    const reservationsCollection = collection(this.firestore, 'eventReservations');
    return collectionData(reservationsCollection, { idField: 'id' }) as Observable<EventReservation[]>;
  }
  getReservationsForRoom(roomId: string): Observable<RoomReservation[]> {
    const reservationsCollection = collection(this.firestore, 'roomReservations');
    const q = query(reservationsCollection, where("roomId", "==", roomId));
    return collectionData(q, { idField: 'id' }) as Observable<RoomReservation[]>;
  }
  getHallReservations():Observable<HallReservation[]>{
    const reservationsCollection = collection(this.firestore, 'hallReservations');
    return collectionData(reservationsCollection, {idField:'id'}) as Observable<HallReservation[]>;
  }
  addHallReservation(reservation: Omit<HallReservation, 'id'>) {
  const reservationsCollection = collection(this.firestore, 'hallReservations');
  return addDoc(reservationsCollection, reservation);
}
  getAllUsers():Observable<User[]>{
    const UserCollection = collection(this.firestore, 'users');
    return collectionData(UserCollection, {idField:'id'}) as Observable<User[]>; 
    }
  
}