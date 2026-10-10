import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Import slices
import createApiSlice, { ApiSlice } from './slices/api.slice';
import createAuthSlice, { AuthSlice } from './slices/auth.slice';
import createCameraSlice, { type CameraSlice } from './slices/camera.slice';
import createEyeTrackingSlice, { type EyeTrackingSlice } from './slices/eye-tracking.slice';
import createFirebaseSlice, { type FirebaseSlice } from './slices/firebase.slice';
import createScreenTimeSlice, { type ScreenTimeSlice } from './slices/screen-time.slice';
import createSocketSlice from './slices/socket.slice';

// Combined store state
export type AppStoreState = ApiSlice &
	AuthSlice &
	CameraSlice &
	ScreenTimeSlice &
	EyeTrackingSlice &
	FirebaseSlice;

export const useAppStore = create<AppStoreState>()(
	persist(
		immer((...a) => ({
			...createCameraSlice(...a),
			...createScreenTimeSlice(...a),
			...createEyeTrackingSlice(...a),
			...createFirebaseSlice(...a),
			...createAuthSlice(...a),
			...createApiSlice(...a),
			...createSocketSlice(...a),
		})),
		{
			name: 'app-storage',
			version: 1,
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export const useBoundStore = create<AppStoreState>((...a) => ({
	...createCameraSlice(...a),
	...createScreenTimeSlice(...a),
	...createEyeTrackingSlice(...a),
	...createFirebaseSlice(...a),
	...createAuthSlice(...a),
	...createApiSlice(...a),
	...createSocketSlice(...a),
}));

export const useBearStore = create<AppStoreState>()(
	persist(
		(...a) => ({
			...createCameraSlice(...a),
			...createScreenTimeSlice(...a),
			...createEyeTrackingSlice(...a),
			...createFirebaseSlice(...a),
			...createAuthSlice(...a),
			...createApiSlice(...a),
			...createSocketSlice(...a),
		}),
		{
			name: 'food-storage', // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
		}
	)
);
export default useAppStore;
