import { Global } from "@emotion/react";
import React from "react";
import { Link, Meta, Title } from "react-head";
import { description, logoUrl, name } from "../../service/package";
import { backgroundColor } from "../../components/_theme";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useImageSrc } from "../imageSpec";

export const Layout = ({ children }: { children: any }) => (
  <>
    <Title>{name}</Title>
    <Meta name="description" content={description} />
    <Link rel="icon" type="image/png" href={useImageSrc(logoUrl)} />
    <Link rel="apple-touch-icon" href={useImageSrc(logoUrl)} />

    <Global
      styles={{
        html: {
          height: "auto",
          overflow: "visible",
          margin: 0,
          backgroundColor,
        },
        body: {
          height: "auto",
          overflow: "visible",
          margin: 0,
          fontFamily: "pokemon-font, helvetica, monospace",
          display: "flex",
          flexDirection: "column",
        },
      }}
    />
    <Header />
    {children}
    <Footer />
  </>
);
