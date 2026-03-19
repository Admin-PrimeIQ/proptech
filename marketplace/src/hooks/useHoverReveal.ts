
export default function useHoverReveal() {
  const moveImage = (
      e: MouseEvent | React.MouseEvent,
      item: HTMLElement
  ) => {
      const itemRect = item.getBoundingClientRect();
      const x = e.clientX - itemRect.left;
      const y = e.clientY - itemRect.top;
      const childElement = item.children[1] as HTMLElement;

      if (childElement) {
          childElement.style.left = `${x}px`;
          childElement.style.top = `${y}px`;
      }
  };

  const handleMouseMove = (
      e: MouseEvent | React.MouseEvent,
      selector: string
  ) => {
      if (typeof window !== 'undefined') {
          const hoverItems = document.querySelectorAll(selector);

          hoverItems.forEach((item) => {
              const element = item as HTMLElement; 
              if (element) moveImage(e, element);
          });
      }
  };

  return {
      handleMouseMove,
  };
}
