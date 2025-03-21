import { Data } from "./types.tsx";
import { useCallback, useState } from "react";

export function useDnD(initialState: Data[]) {
  // Используется для добавления / удаления класса
  const [isDrag, setIsDrag] = useState(false),
    // Используется для динамического изменения данных
    [listItems, setListItems] = useState<Data[]>(initialState),
    handleDragging = useCallback((drag: boolean) => setIsDrag(drag), []),
    handleUpdateList = useCallback(
      (id: number, columnId: number) => {
        const card = listItems.find((item) => item.id === id);

        // Если перетаскиваемая карточка не равняется значению области перетаскивания
        if (card && card.zone !== columnId) {
          card.zone = columnId;

          setListItems([card, ...listItems.filter((item) => item.id !== id)]);
        }
      },
      [listItems],
    );

  return { isDrag, listItems, handleDragging, handleUpdateList };
}
