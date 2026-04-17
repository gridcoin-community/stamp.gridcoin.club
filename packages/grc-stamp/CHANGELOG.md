# [grc-stamp-v1.3.0](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.2.2...grc-stamp-v1.3.0) (2026-04-17)


### Bug Fixes

* add clear cache function, fix integration tests ([71c9b8f](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/71c9b8fe19e10b2836689228d64eb6022544c083))
* fix stale pending message ([59852f1](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/59852f1bd33ad52388870dfe30cfd055a1076cc0))
* **grc-stamp:** prevent duplicate stamps from concurrent requests with same hash ([fd4d699](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/fd4d6992b6689fd8de331d20ccc5e4d24bacc6f4))


### Features

* **grc-stamp:** broadcast live pending-stamp count via SSE ([f8a88ae](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/f8a88ae2ae1edc2ba8e2e78012f19bb29d75efd8))


### Performance Improvements

* **grc-stamp:** account for queued stamps' burn cost in balance check ([766d9b6](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/766d9b697c867e8d32225e11f62c7386170e2429))
* **grc-stamp:** cache wallet balance with 15s TTL and coalesce concurrent calls ([cffe622](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/cffe622589b382ca6bcd2a171344c36a53b23389))
* **grc-stamp:** drain pending stamps per publish cycle ([4e59429](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/4e59429b3b9b61e35f23f3cbc6c3b71f92569e3e))
* **grc-stamp:** index tx column to speed up pending-stamp queries ([f68654d](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/f68654d2fa80e9c353e6f40145c628774b0b13b5))

# [grc-stamp-v1.2.2](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.2.1...grc-stamp-v1.2.2) (2026-04-11)


### Bug Fixes

* add headers for sse hope to defeat cloudflare ([ff746a4](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/ff746a458d5c9544a14e89297e9100840dbf9d19))
* fix casting bug causing the system restart ([c73371d](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/c73371db031dc260a497c83b27cb54f401263d52))

# [grc-stamp-v1.2.1](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.2.0...grc-stamp-v1.2.1) (2025-09-21)


### Bug Fixes

* send keep alive to all clients ([964b92a](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/964b92a8687b544cb41f29b5d9345b83abe179b3))

# [grc-stamp-v1.2.0](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.1.8...grc-stamp-v1.2.0) (2025-09-21)


### Features

* introduce SSE ([e9f75af](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/e9f75afb02212dcae0be5d27b515966c4b75bd1e))

# [grc-stamp-v1.1.8](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.1.7...grc-stamp-v1.1.8) (2025-09-18)


### Bug Fixes

* change user creation step for debian based images ([c4c52df](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/c4c52df22c35d5de17cc13e054f4081683e1fd42))

# [grc-stamp-v1.1.7](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.1.6...grc-stamp-v1.1.7) (2025-09-18)


### Bug Fixes

* node debian for grc-stamp ([86afc36](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/86afc3608c67b9c0392cef9242f565c1106ec077))

# [grc-stamp-v1.1.6](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.1.5...grc-stamp-v1.1.6) (2025-09-18)


### Bug Fixes

* fix prisma generation on start ([903766e](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/903766e8ee8bafb5531a5d845c3152644019f066))

# [grc-stamp-v1.1.5](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.1.4...grc-stamp-v1.1.5) (2025-09-18)


### Bug Fixes

* fix prisma on start ([98d60b7](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/98d60b79d086e5fb53637a323798b7e66f6f8f52))

# [grc-stamp-v1.1.4](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.1.3...grc-stamp-v1.1.4) (2025-09-17)


### Bug Fixes

* fix production dockerfile ([51798b4](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/51798b40292251d8d2de189aad1e657b9592cd15))

# [grc-stamp-v1.1.3](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.1.2...grc-stamp-v1.1.3) (2025-09-17)


### Bug Fixes

* technical update dependencies ([f08fd89](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/f08fd89753caf33124df04366440f20febe24b8d))

# [grc-stamp-v1.1.2](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.1.1...grc-stamp-v1.1.2) (2025-09-17)


### Bug Fixes

* technical, upgrade dependencies ([4c757b8](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/4c757b86a2574ff8e748b4fb62692b1f9bcf6c1c))

# [grc-stamp-v1.1.1](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.1.0...grc-stamp-v1.1.1) (2024-05-03)


### Bug Fixes

* increase blocks number to process all at once to 1500 ([ffd4ee3](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/ffd4ee3bb19e2e3a31ad2a9d593ca07186f241f2))

# [grc-stamp-v1.1.0](https://github.com/gridcoin-community/stamp.gridcoin.club/compare/grc-stamp-v1.0.0...grc-stamp-v1.1.0) (2024-05-01)


### Features

* **upgrade:** upgrade node and dependncies ([f248035](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/f248035670260a36c84a7b54eb0a7eb34cb8c3b9))

# grc-stamp-v1.0.0 (2022-10-22)


### Bug Fixes

* do not create the record if hash exists ([2044b07](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/2044b0727af6d180a88c09d84b32b81ecb3e8110))
* **docker:** fix docker version for the build proces ([461481e](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/461481ec4ac9c78ad858f7a9a385cd7e0395eb4d))
* enchance joi validator for sha256 ([b3c156f](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/b3c156fbaa36f3b5b464e4fe6409cf4398fd45bf))
* **logger:** fix non-existing call to warning ([192680b](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/192680b95754d7e69455525990d65799c25fe985))
* not found for get by id ([2e54aba](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/2e54abae63c2fd6488537f57ae036d03283d2331))
* **package.json:** do not use repository block here to make it do releases ([c9733f2](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/c9733f2da0f952ba1270e96a63c5e59ee369cf78))


### Features

* add block prefix as env variable ([8d67d1a](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/8d67d1a1a92abf182f1965617e6eb48bdbae636b))
* add create stamp API call ([e2b95b7](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/e2b95b7e2ea62756f20543f02e1fa2bb4027a71b))
* add custom presenter to the render controller method ([2057e60](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/2057e6047f203a02b261b1321551070a0701d799))
* add sorting to the list ([616c428](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/616c428eac4dc25440417443c310e76af088929d))
* add wallet route ([91a2832](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/91a28325f1e534ef36a90da458a217d498332179))
* **api:** add balance call ([59d9900](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/59d9900fefb01e0107254bf9072c3969852473a7))
* check wallet balance before transaction submit ([2c3ebab](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/2c3ebab4019bf8d0c555f08eac79687fc6b196fa))
* **grc-stamp:** add maintenance flag in the status call ([4c98a91](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/4c98a9115344cf283c34d05acaa458a314832462))
* initial conventional commit ([129eb10](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/129eb108ab17a07bc192af3d18fcabde0df577ff))
* introduce hashes endpoint ([1656292](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/16562921a399250377c556e2a01def6001d26d3c))
* **node:** use node 16 ([9ced4b0](https://github.com/gridcoin-community/stamp.gridcoin.club/commit/9ced4b0279d168eeddd4100d51954e280bd04936))
