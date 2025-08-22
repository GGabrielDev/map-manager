import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { LatLngExpression } from 'leaflet';

// Define the shape of your map state
interface MapState {
  center: LatLngExpression;
  zoom: number;
}

// Define the initial state
// Try to load from localStorage first, otherwise use defaults
const loadState = (): MapState => {
  try {
    const serializedState = localStorage.getItem('mapState');
    if (serializedState === null) {
      // Default values if no state is found in local storage
      return {
        center: [8.345380014941664, -62.690057677741386], // Your default center
        zoom: 12, // Your default zoom
      };
    }
    const storedState: MapState = JSON.parse(serializedState);
    // Basic validation to ensure storedState has expected properties
    if (Array.isArray(storedState.center) && typeof storedState.zoom === 'number') {
      return storedState;
    }
    // Fallback to defaults if stored state is malformed
    return {
      center: [8.345380014941664, -62.690057677741386],
      zoom: 12,
    };
  } catch (error) {
    console.error("Failed to load map state from local storage:", error);
    // Fallback to defaults on error
    return {
      center: [8.345380014941664, -62.690057677741386],
      zoom: 12,
    };
  }
};

const initialState: MapState = loadState();

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapState: (state, action: PayloadAction<{ center: LatLngExpression; zoom: number }>) => {
      state.center = action.payload.center;
      state.zoom = action.payload.zoom;
      // Save to local storage whenever state changes
      try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('mapState', serializedState);
      } catch (error) {
        console.error("Failed to save map state to local storage:", error);
      }
    },
    resetMapState: (state) => {
      state.center = [8.345380014941664, -62.690057677741386]; // Your default center
      state.zoom = 12; // Your default zoom
      try {
        localStorage.removeItem('mapState'); // Clear from local storage
      } catch (error) {
        console.error("Failed to clear map state from local storage:", error);
      }
    },
  },
});

export const { setMapState, resetMapState } = mapSlice.actions;
export default mapSlice.reducer;
