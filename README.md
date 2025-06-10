# @ntf/buffer

Another buffer library

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

The main class is called `Buffer` (yes, the same as in the NodeJS but **they're not the same!**). It works the following:

- reading/writing data will cause the buffer to step to the next data in the buffer (like a stream or better yet: the Java [`DataInputStream`](https://docs.oracle.com/javase/8/docs/api/java/io/DataInputStream.html) and [`DataOutputStream`](https://docs.oracle.com/javase/8/docs/api/java/io/DataOutputStream.html) class)
- you can change the positions with the `readOffset`/`writeOffset` attribute
- you can allocate a zero-filled buffer with the static `create` method
- the static methods `fromBlob`/`fromTypedArray`/`fromResponse` converts `Blob`, `Response` instances and any kind of [Typed Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays#typed_array_views) to a `Buffer` (this includes the NodeJS `Buffer` class because it's just a `Uint8Array` ~~but with shitty read/write functions in my opinion~~)

```typescript
import { Buffer } from "@ntf/buffer";

const myVeryCoolBuffer = Buffer.create(100); // creates a zero-filled buffer with the size of 100 bytes
const someRandomAssBuffer = await Buffer.fromAsync(someRandomAssBlobOrResponse) // this static method returns a Promise<Buffer>
```

### I'm on NodeJS and that shitty class replaces the NodeJS Buffer class!!!!11!!1

stop crying you baby, you know you can change the name of the import?

```typescript
import { Buffer as SomeOtherNameThatIsNotBuffer } from "@ntf/buffer"; // ES Module
const thatShittyBufferThatReplacesTheNodeJsBuffer = require("@ntf/buffer").Buffer; // CommonJS
```

## License stuff that nobody reads

Just like any [Open Source Project](https://github.com/N1ghtTheF0x/ntf-buffer) this has a [License](./LICENSE), the MIT License
