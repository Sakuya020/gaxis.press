import { CatalogueType } from "@/lib/types";
import { cn, getImageUrl } from "@/lib/utils";

const Modal = ({
  modal,
  catalogue,
  className,
}: {
  modal: { active: boolean; no: number };
  catalogue: CatalogueType[];
  className?: string;
}) => {
  if (!modal.active) return null;
  const selectedItem = catalogue.filter((item) => item.no === modal.no)[0];
  if (!selectedItem || !selectedItem.thumbnail) return null;

  return (
    <div className={cn("pointer-events-none", className)}>
      <div>
        <img
          src={getImageUrl(selectedItem.thumbnail)}
          alt={selectedItem.title}
        />
      </div>
    </div>
  );
};

export default Modal;
