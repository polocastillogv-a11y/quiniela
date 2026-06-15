import { create } from 'zustand'

const useBackgroundStore = create((set) => ({
  alternate: false,
  setAlternate: (val) => set({ alternate: val }),
}))

export default useBackgroundStore
