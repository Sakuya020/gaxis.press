"use client";

import { useState } from "react";
import CatalogueLine from "./CatalogueLine";
import { CatalogueType } from "@/lib/types";
import Modal from "./Modal";
import { useSidebarStore } from "@/lib/store/sidebar";
import useCatalogueOrderStore from "@/lib/store/catalogueOrder";

const Catalogue = ({ catalogue }: { catalogue: CatalogueType[] }) => {
  const [modal, setModal] = useState({ active: false, no: 0 });
  const isOpen = useSidebarStore((state) => state.isOpen);
  const { order } = useCatalogueOrderStore();

  const sortedCatalogue = [...catalogue].sort((a, b) => {
    return order === "asc" ? a.no - b.no : b.no - a.no;
  });

  return (
    <section className="relative">
      {sortedCatalogue.map((item) => {
        return <CatalogueLine key={item.no} item={item} setModal={setModal} />;
      })}
      {modal.active && !isOpen && (
        <Modal
          modal={modal}
          catalogue={catalogue}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[222px] h-[222px] border border-foreground"
        />
      )}
    </section>
  );
};

export default Catalogue;
