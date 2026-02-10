export const IPC_CHANNELS = {
  DEMO: {
    DEMONSTRATE_FUNCTION: 'DEMONSTRATE_FUNCTION',
  },
} as const;

type ChannelValues<T> = T extends object
  ? { [K in keyof T]: ChannelValues<T[K]> }[keyof T]
  : T;

export type Channel = ChannelValues<typeof IPC_CHANNELS>;
