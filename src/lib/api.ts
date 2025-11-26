// API configuration for local backend
const API_BASE_URL = 'http://localhost:8080/api';

export interface Hotel {
  id: number;
  name: string;
  address: string;
  description: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  city: string;
  country: string;
}

export interface SearchFilters {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface Booking {
  id?: number;
  hotelId: number;
  hotelName?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status?: string;
  createdAt?: string;
}

export interface BookingRequest {
  hotelId: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

// API functions
export const api = {
  // Fetch all hotels
  getHotels: async (filters?: SearchFilters): Promise<Hotel[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE_URL}/hotels${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch hotels');
    }
    
    return response.json();
  },

  // Fetch single hotel by ID
  getHotelById: async (id: number): Promise<Hotel> => {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch hotel');
    }
    
    return response.json();
  },

  // Search hotels
  searchHotels: async (query: string): Promise<Hotel[]> => {
    const response = await fetch(`${API_BASE_URL}/hotels/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search hotels');
    }
    
    return response.json();
  },

  // Create booking
  createBooking: async (booking: BookingRequest): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
    
    return response.json();
  },

  // Get booking by ID
  getBookingById: async (id: number): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch booking');
    }
    
    return response.json();
  },

  // Get all bookings
  getBookings: async (): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    
    return response.json();
  },
};
