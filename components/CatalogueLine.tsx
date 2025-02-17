import { Catalogue } from "@/lib/types";
import { getImageUrl, formatDate, cn } from "@/lib/utils";

const CatalogueLine = ({ item }: { item: Catalogue }) => {
  const { title, image, status, date, no, availableAt, collectionAt } = item;
  const formattedDate = formatDate(date);

  return (
    <div className="grid grid-cols-12 gap-[10px] border-b border-secondary px-[30px] py-[20px]">
      {/* No. */}
      <div className="col-span-1">No.{no}</div>
      {/* Date */}
      <div className="col-span-1">{formattedDate}</div>
      {/* title */}
      <div
        className={cn("col-span-5", status === "sold out" && "line-through")}
      >
        {title}
      </div>
      {/* status */}
      {status === "coming soon" && (
        <div className="col-span-5">[coming soon]</div>
      )}
      {(status === "available" || status === "sold out") && (
        <div className="col-span-5">
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
                Collection at{" "}
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
