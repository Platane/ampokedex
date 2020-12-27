import { css } from "@emotion/css";
import { Global } from "@emotion/react";
import React from "react";
import { Link, Meta, Title } from "react-head";
import { description, logoUrl, name } from "../../service/package";
import { BaseUrlConsumer } from "../Link";
import { backgroundColor } from "../../components/_theme";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { createFontFace } from "../fontFace";

export const Layout = ({ children }: { children: any }) => (
  <>
    <Title>{name}</Title>
    <Link rel="icon" type="image/png" href={logoUrl} />
    <Meta name="description" content={description} />

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
        },
      }}
    />

    <Header />
    {children}
    <Footer />
  </>
);
