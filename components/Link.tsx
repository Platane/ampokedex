import React, { createContext, useContext } from "react";

const context = createContext("");

export const Provider = ({
  baseUrl,
  children,
}: {
  baseUrl: string;
  children: any;
}) => React.createElement(context.Provider, { value: baseUrl }, children);

export const useBaseUrl = () => useContext(context);

export const Link = ({ href, children }: { href: string; children: any }) => {
  const baseUrl = useBaseUrl();

  const h = baseUrl + href + ".html";

  return <a href={h}>{children}</a>;
};
