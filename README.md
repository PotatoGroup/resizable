# @astii/resizable

[![NPM version](https://img.shields.io/npm/v/@astii/resizable.svg?style=flat)](https://npmjs.org/package/@astii/resizable)
[![NPM downloads](http://img.shields.io/npm/dm/@astii/resizable.svg?style=flat)](https://npmjs.org/package/@astii/resizable)

## Install

```bash
$ yarn install @astii/resizable
```

## Usage

```ts
import React, { useState } from "react";
import { Resizable } from "@astii/resizable";

export default () => {
  const [style, setStyle] = useState<React.CSSProperties>({
    width: 200,
    height: 200,
    backgroundColor: "red",
  });

  const onResize = ({width, height}) => {
    setStyle(pre => ({...pre, width, height}))
  }
  return (
    <Resizable onResize={onResize} >
      <div style={style}></div>
    </Resizable>
  );
};

```
## Options

```ts
interface ResizableProps {
  axis?: "x" | "y" | "both";  //resize direction
  zoom?: number;   //scaling
  onResizeStart?: () => void;  //Executed when dragging starts
  onResize?: (size: {
    width: CSSProperties["width"];
    height: CSSProperties["height"];
  }) => void;  //Executed when dragging
  onResizeStop?: () => void;  //Executed when dragging ends
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  className?: string;
}
```

## LICENSE

MIT
