import React, {
  useRef,
  cloneElement,
  ReactElement,
  JSXElementConstructor,
  CSSProperties,
  useMemo,
  Children,
  useCallback,
} from "react";
import styles from "./index.module.less";

type OffsetType = [number, number];

export interface ResizableProps {
  axis?: "x" | "y" | "both";
  zoom?: number;
  onResizeStart?: () => void;
  onResize?: (size: {
    width: CSSProperties["width"];
    height: CSSProperties["height"];
  }) => void;
  onResizeStop?: () => void;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  className?: string;
}
const Resizable = ({
  axis = "x",
  zoom = 1,
  onResizeStart,
  onResize,
  onResizeStop,
  children,
  className,
}: ResizableProps) => {
  const preRect = useRef<DOMRect>();
  const { children: targetChildren, ...rest } = children.props;

  const resizeStartHandler = (e) => {
    preRect.current = e.target.parentNode.getBoundingClientRect();
    onResizeStart && onResizeStart();
  };

  const resizeHandler = useCallback(
    (offset: OffsetType) => {
      const { width = 0, height = 0 } = preRect.current ?? {};
      const dx = offset[0];
      const dy = offset[1];
      onResize &&
        onResize({
          width: Math.max(
            Math.floor((width + (axis === "y" ? 0 : dx)) / zoom),
            0
          ),
          height: Math.max(
            Math.floor((height + (axis === "x" ? 0 : dy)) / zoom),
            0
          ),
        });
    },
    [axis]
  );

  const resizeStopHandler = () => {
    onResizeStop && onResizeStop();
  };

  const resizerTypes = useMemo(() => {
    if (axis === "x" || axis === "y") return [axis];
    if (axis === "both") return ["x", "y"];
    return [];
  }, [axis]);

  return cloneElement(
    children,
    {
      ...rest,
      className: `${rest.className} ${styles.resizable}`,
    },
    [
      ...Children.toArray(targetChildren),
      ...resizerTypes.map((type) => (
        <ResizeBar
          key={`resizer-${type}`}
          axis={type as "x" | "y"}
          onMouseDown={resizeStartHandler}
          onMouseMove={resizeHandler}
          onMouseUp={resizeStopHandler}
          className={className}
        />
      )),
    ]
  );
};

type ResizeBarProps = {
  axis?: "x" | "y";
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (offset: OffsetType) => void;
  onMouseUp: () => void;
  className?: string;
};

const ResizeBar = ({
  axis = "x",
  onMouseDown,
  onMouseMove,
  onMouseUp,
  className,
}: ResizeBarProps) => {
  const startPosition = useRef<OffsetType>([0, 0]);
  const mouseDownHandler = (e: React.MouseEvent) => {
    startPosition.current = [e.clientX, e.clientY];
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    onMouseDown && onMouseDown(e);
    e.stopPropagation();
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    const dx = e.clientX - startPosition.current[0];
    const dy = e.clientY - startPosition.current[1];
    onMouseMove && onMouseMove([dx, dy]);
  };

  const mouseUpHandler = () => {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    onMouseUp && onMouseUp();
  };

  const mouseOverHandler = useCallback(() => {
    const hoverEvent = new CustomEvent("hover", {
      detail: {
        axis,
      },
    });
    document.dispatchEvent(hoverEvent);
  }, [axis]);

  const mouseLeaveHandler = useCallback(() => {
    const leaveEvent = new CustomEvent("leave", {
      detail: {
        axis,
      },
    });
    document.dispatchEvent(leaveEvent);
  }, [axis]);

  return (
    <div
      className={`${axis === "x" ? styles["resizer-r"] : styles["resizer-b"]} ${
        className ?? ""
      }`}
      onMouseDown={mouseDownHandler}
      onMouseOver={mouseOverHandler}
      onMouseLeave={mouseLeaveHandler}
    />
  );
};

export { Resizable };
