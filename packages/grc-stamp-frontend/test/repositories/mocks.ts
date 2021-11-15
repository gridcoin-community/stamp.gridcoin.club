const body1 = {
  protocol: '0.0.1',
  type: 'sha256',
  hash: 'f6fc84c9f21c24907d6bee6eec38cabab5fa9a7be8c4a7827fe9e56f245bd2d5',
  block: 1654233,
  tx: '782f131b9ef917669040f8a4bd94596275fcee0ac4a628a765a09674ed6d519f',
  rawTransaction: '6a26f055aa000001f6fc84c9f21c24907d6bee6eec38cabab5fa9a7be8c4a7827fe9e56f245bd2d5',
  time: 1629273488,
  createdAt: '2021-08-18T07:59:34.000Z',
  updatedAt: '2021-08-18T07:59:34.000Z',
};
const body2 = {
  protocol: '0.0.1',
  type: 'sha256',
  hash: '47e6e3712f7a664ddfc3b52f8b8c7ef418ea1d8c18c236ae930459e65fa72362',
  block: 1720423,
  tx: 'ef15887503bf0304834c1dd85d856fb0b2581d6842b88fa93367ff33fb48e9f6',
  rawTransaction: '6a26f055aa00000147e6e3712f7a664ddfc3b52f8b8c7ef418ea1d8c18c236ae930459e65fa72362',
  time: 1635803008,
  createdAt: '2021-11-01T21:38:52.000Z',
  updatedAt: '2021-11-01T21:44:05.000Z',
};

export const getDataMock = {
  data: {
    id: '2',
    type: 'stamps',
    attributes: {
      ...body1,
    },
    links: { self: '/stamps/2' },
  },
};

export const HashListMock = {
  meta: { count: 2 },
  data: [
    {
      id: '2',
      type: 'stamps',
      attributes: {
        ...body1,
      },
      links: { self: '/stamps/2' },
    },
    {
      id: '3',
      type: 'stamps',
      attributes: {
        ...body2,
      },
      links: { self: '/stamps/3' },
    },
  ],
};
