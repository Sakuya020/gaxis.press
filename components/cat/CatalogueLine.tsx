import { CatalogueType } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";

const CatalogueLine = ({
  item,
  setModal,
}: {
  item: CatalogueType;
  setModal: (modal: { active: boolean; no: number }) => void;
}) => {
  const { title, status, date, no, availableAt, collectionAt } = item;
  const formattedDate = formatDate(date);

  return (
    <div
      className="grid grid-cols-6 md:grid-cols-12 md:gap-[10px] border-b border-secondary px-[30px]"
      key={title}
    >
      {/* No. */}
      <div className="col-span-1 py-[10px] md:py-[20px]">No.{no}</div>
      {/* Date */}
      <div className="col-span-1 py-[20px] hidden lg:block">
        {formattedDate}
      </div>
      {/* title */}
      <div
        className={cn(
          "col-span-5 md:col-span-6 lg:col-span-5 py-[10px] md:py-[20px]",
          status === "sold out" && "line-through"
        )}
        onMouseEnter={() => setModal({ active: true, no })}
        onMouseLeave={() => setModal({ active: false, no })}
      >
        {title}
      </div>
      {/* status */}
      {status === "coming soon" && (
        <div className="col-span-5 py-[20px] hidden md:block">
          [coming soon]
        </div>
      )}
      {(status === "available" || status === "sold out") && (
        <div className="col-span-5 py-[20px] hidden md:block">
          {availableAt && (
            <>
              <span>
                Available at{" "}
                {availableAt?.map((item, index) => {
                  return (
                    <div key={index} className="inline-block">
                      <a href={item.url} target="_blank" className="underline">
                        {item.name}
                      </a>
                      {index !== availableAt.length - 1 && <span>,&nbsp;</span>}
                    </div>
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
                      <a
                        href={item.url}
                        key={index}
                        target="_blank"
                        className="underline"
                      >
                        {item.name}
                      </a>
                      {index !== collectionAt.length - 1 && (
                        <span>,&nbsp;</span>
                      )}
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
