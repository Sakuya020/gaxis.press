"use client";

import { PortableText } from "next-sanity";

const CustomPortableText = ({ value }: { value: any; className?: string }) => {
  return (
    <PortableText
      value={value}
      components={{
        marks: {
          link: ({ children, value }) => {
            return (
              <a
                href={value.href}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="underline"
              >
                {children}
              </a>
            );
          },
        },
      }}
    />
  );
};

export default CustomPortableText;
