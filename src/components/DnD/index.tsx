import "./style.less";
import { Zone, Data } from "../../types.tsx";
import { DATA } from "./data.tsx";
import React, { useCallback } from "react";
import { useDnD } from "../../hooks.tsx";

type CardItemProps = {
  data: Data;
  handleDragging: (v: boolean) => void;
};

function CardItem({ data, handleDragging }: CardItemProps) {
  const handleDragEnd = useCallback(
    () => handleDragging(false),
    [handleDragging],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData("text/plain", `${data.id}`);
      handleDragging(true);
    },
    [data.id, handleDragging],
  );

  return (
    <div
      className="CardItem"
      draggable
      // срабатывает, когда пользователь закончил перетаскивание элемента
      onDragEnd={handleDragEnd}
      // срабатывает в начале операции перетаскивания элемента
      onDragStart={handleDragStart}
    >
      <div>{data.content}</div>
    </div>
  );
}

type ContainerCardsProps = {
  zone: Zone;
  items: Data[];
  draggable: boolean;
  handleDragging: (v: boolean) => void;
  handleUpdateList: (id: number, column: number) => void;
};

function Zones({
  zone,
  items = [],
  draggable,
  handleDragging,
  handleUpdateList,
}: ContainerCardsProps) {
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }, []),
    handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const id = +e.dataTransfer.getData("text/plain");

        handleUpdateList(id, zone.id);

        handleDragging(false);
      },
      [zone, handleDragging, handleUpdateList],
    );

  return (
    <div
      className={`Zones${draggable ? " isDraggable" : ""}`}
      // срабатывает, когда элемент перемещают над допустимой зоной для переноса
      onDragOver={handleDragOver}
      // срабатывает после того, как перетаскиваемый элемент опустился на объект перетаскивания
      onDrop={handleDrop}
    >
      <div>{zone.name}</div>

      <div>
        {items.map((item) => {
          // В колонке остаются те элементы, свойство (zone) которых равняется id колонки
          if (zone.id === item.zone) {
            return (
              <CardItem
                key={item.id}
                data={item}
                handleDragging={handleDragging}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

const ZONES: Zone[] = [
  { id: 1, name: "Область 1" },
  { id: 2, name: "Область 2" },
  { id: 3, name: "Область 3" },
];

function DnD({ data = DATA }: { data: Data[] }) {
  const { isDrag, listItems, handleDragging, handleUpdateList } = useDnD(data);

  return (
    <div
      className="DnD"
      style={{ "--columns": ZONES.length } as React.CSSProperties}
    >
      {ZONES.map((zone) => (
        <Zones
          key={zone.id}
          zone={zone}
          items={listItems}
          draggable={isDrag}
          handleDragging={handleDragging}
          handleUpdateList={handleUpdateList}
        />
      ))}
    </div>
  );
}

export default DnD;
