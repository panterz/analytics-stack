import {
  createRoomShellSlice,
  createRoomStore,
  RoomShellSliceState,
  LayoutTypes,
} from '@sqlrooms/room-shell';
import {DatabaseIcon} from 'lucide-react';

/**
 * The whole room state.
 */
export type RoomState = RoomShellSliceState & {
  // Add your custom app state types here
};

/**
 * Create the room store. You can combine your custom state and logic
 * with the slices from the SQLRooms modules.
 */
export const {roomStore, useRoomStore} = createRoomStore<RoomState>(
  (set, get, store) => ({
    ...createRoomShellSlice({
      config: {
        title: 'Analytics Stack',
        dataSources: [],
      },
    })(set, get, store),
  }),
);
