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

export const Link = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: any;
  style?: any;
}) => {
  const baseUrl = useBaseUrl();

  href = baseUrl + href;

  // if (href[href.length - 1] === "/") href += "index";

  // href += ".html";

  return (
    <a {...props} href={href}>
      {children}
    </a>
  );
};
