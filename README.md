# @ntf/buffer

Another binary data manipulation library

## Why

Because I like reinventing the wheel :)

## Installation

Use your favourite package manager, idk

```sh
npm install @ntf/buffer
```

```sh
yarn add @ntf/buffer
```

```sh
pnpm install @ntf/buffer
```

## Usage

### Importing

This library can be used in `CommonJS` and `ESModule` environments

```typescript
const { ... } = require("@ntf/buffer");
```

```typescript
import { ... } from "@ntf/buffer";
```

### `MemoryRegion`

The class `MemoryRegion` is a view of an array buffer, it wraps around `DataView`. Unlike Typed Arrays and NodeJS's Buffer it can do the following:

- reading/writing data will cause to step to the next data in the region (like a stream or better yet: the Java [`DataInputStream`](https://docs.oracle.com/javase/8/docs/api/java/io/DataInputStream.html) and [`DataOutputStream`](https://docs.oracle.com/javase/8/docs/api/java/io/DataOutputStream.html) class)
- you can change the positions with the `readOffset`/`writeOffset` attribute or their methods `setReadOffset`/`setWriteOffset`
- you can allocate a zero-filled buffer with the static `allocate` method
- the static methods `fromArrayBufferView`/`fromAsync` converts `Blob`, `Response` instances and any kind of [Typed Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays#typed_array_views) to a `MemoryRegion` _(this includes the NodeJS `Buffer` class because it's just a `Uint8Array` ~~but with shitty read/write functions in my opinion~~)_
- merge any kind of binary data into one with the static method `merge`

```typescript
import { MemoryRegion } from "@ntf/buffer";

const myVeryCoolBuffer = MemoryRegion.allocate(100); // allocates a zero-filled memory region with the size of 100 bytes
const someRandomAssBuffer = await Buffer.fromAsync(someRandomAssBlobOrResponse) // this static method returns a Promise<MemoryRegion>
```

## License stuff that nobody reads

Just like any [Open Source Project](https://github.com/N1ghtTheF0x/ntf-buffer) this has a [License](./LICENSE), the MIT License
