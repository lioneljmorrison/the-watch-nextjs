import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DeviceListStatus } from '../../../pages/api/v1/deviceInterfaces';

interface WatchStoreState {
  _hasHydrated: boolean;
  accountId: string | null;
  setAccountId: (id: string) => void;
  collection: DeviceListStatus;
  getCollection: () => void;
}

export const useDataStore = create<WatchStoreState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      accountId: null,
      setAccountId: (id: string) => set({ accountId: id }),
      collection: {},
      getCollection: () => {
        const fetch = require('node-fetch');

        let url = `/api/v1/datastore/devices/collection/status/${get().accountId}`;

        let options = { method: 'GET', headers: { 'User-Agent': 'the-watch/0.1.0' } };

        fetch(url, options)
          .then((res: any) => res.json())
          .then((json: DeviceListStatus) => set({ collection: json }))
          .catch((err: unknown) => console.error('error:' + err));
      },
    }),
    {
      name: 'the-watch-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state._hasHydrated = true;
      },
    }
  )
);
