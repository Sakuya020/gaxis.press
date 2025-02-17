import { CatalogueType } from "@/lib/types";
import { getImageUrl, formatDate, cn } from "@/lib/utils";

const CatalogueLine = ({
  item,
  setModal,
}: {
  item: CatalogueType;
  setModal: (modal: { active: boolean; no: number }) => void;
}) => {
  const { title, status, date, no, availableAt, collectionAt, thumbnail } =
    item;
  const formattedDate = formatDate(date);
  const thumbnailUrl = thumbnail ? getImageUrl(thumbnail) : null;

  return (
    <div className="grid grid-cols-12 gap-[10px] border-b border-secondary px-[30px]">
      {/* No. */}
      <div className="col-span-1 py-[20px]">No.{no}</div>
      {/* Date */}
      <div className="col-span-1 py-[20px]">{formattedDate}</div>
      {/* title */}
      <div
        className={cn(
          "col-span-5 py-[20px]",
          status === "sold out" && "line-through"
        )}
        onMouseEnter={() => setModal({ active: true, no })}
        onMouseLeave={() => setModal({ active: false, no })}
      >
        {title}
      </div>
      {/* status */}
      {status === "coming soon" && (
        <div className="col-span-5 py-[20px]">[coming soon]</div>
      )}
      {(status === "available" || status === "sold out") && (
        <div className="col-span-5 py-[20px]">
          {availableAt && (
            <>
              <span>
                Available at{" "}
                {availableAt?.map((item, index) => {
                  return (
                    <>
                      {index !== 0 && <span>, </span>}
                      <a
                        href={item.url}
                        key={index}
                        target="_blank"
                        className="underline"
                      >
                        {item.name}
                      </a>
                    </>
                  );
                })}
              </span>
            </>
          )}

          {collectionAt && (
            <>
              {availableAt && <span>; </span>}
              <span>
                collection at{" "}
                {collectionAt.map((item, index) => {
                  return (
                    <>
                      {index !== 0 && <span>, </span>}
                      <a
                        href={item.url}
                        key={index}
                        target="_blank"
                        className="underline"
                      >
                        {item.name}
                      </a>
                    </>
                  );
                })}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogueLine;
