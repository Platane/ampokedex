import React from "react";

const ampBoilerPlateStyle =
  "body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}";
const ampBoilerPlateStyleNoScript =
  "body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}";
export const ampBoilerPlate = [
  <style
    amp-boilerplate="true"
    dangerouslySetInnerHTML={{ __html: ampBoilerPlateStyle }}
  />,
  <noscript>
    <style
      amp-boilerplate="true"
      dangerouslySetInnerHTML={{ __html: ampBoilerPlateStyleNoScript }}
    />
  </noscript>,
];
