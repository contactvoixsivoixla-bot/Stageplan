"use client";

import { Layer, Line, Rect, Stage, Text } from "react-konva";
import { usePlanStore } from "@/store/planStore";

const WIDTH = 900;
const HEIGHT = 560;
const GRID_SIZE = 20;

export function SceneCanvas() {
  const { elements, move, select, selectedId, zoom } = usePlanStore();
  const gridLines = [];
  for (let x = 20; x <= 880; x += GRID_SIZE) gridLines.push(<Line key={`vx-${x}`} points={[x, 20, x, 540]} stroke="#e2e8f0" strokeWidth={1} />);
  for (let y = 20; y <= 540; y += GRID_SIZE) gridLines.push(<Line key={`hy-${y}`} points={[20, y, 880, y]} stroke="#e2e8f0" strokeWidth={1} />);

  return (
    <div className="rounded-lg border bg-white p-2">
      <div className="mb-2 text-center text-sm font-semibold">CÔTÉ PUBLIC</div>
      <div className="overflow-auto">
        <Stage width={WIDTH * zoom} height={HEIGHT * zoom} className="mx-auto border bg-slate-50" onMouseDown={(e) => e.target === e.target.getStage() && select(null)}>
          <Layer scaleX={zoom} scaleY={zoom}>
            <Rect x={20} y={20} width={860} height={520} fill="#f8fafc" stroke="#64748b" strokeWidth={2} cornerRadius={6} />
            {gridLines}
            {elements.map((el) => (
              <Text key={el.id} x={el.x} y={el.y} text={el.label} fontSize={14} rotation={el.rotation} draggable fill={selectedId === el.id ? "#0f172a" : "#334155"} onClick={() => select(el.id)} onTap={() => select(el.id)} onDragEnd={(evt) => move(el.id, evt.target.x(), evt.target.y())} />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
