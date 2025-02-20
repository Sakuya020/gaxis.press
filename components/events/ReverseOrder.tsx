"use client";

import useCatalogueOrderStore from "@/lib/store/catalogueOrder";

const ReverseOrder = () => {
  const { order, setOrder } = useCatalogueOrderStore();
  return (
    <button
      onClick={() => setOrder(order == "asc" ? "desc" : "asc")}
      className="w-fit font-sans text-start"
    >
      {order == "asc" ? "↑" : "↓"}
    </button>
  );
};

export default ReverseOrder;
