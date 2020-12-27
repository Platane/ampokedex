/**
 * the head tags returned by react-head are not de-duplicated
 * do that
 *  + remove props for hydration that we don't use
 *  + sort them
 */
export const formatHeadTags = (headTags: React.ReactElement[]) => {
  const key = (t: any) => [t.type, t.props.rel, t.props.name].join(":");

  return headTags
    .reverse()
    .filter((t, i, arr) => i === arr.findIndex((t2) => key(t) === key(t2)))
    .map((t) => {
      const { "data-rh": _, ...props } = t.props || {};
      return { ...t, props };
    });
};

export const sortHeadTags = (headTags: React.ReactElement[]) => {
  const key = (t: any) =>
    [t.type, t.props.rel, t.props.name, t.props.src].join(":");

  return headTags
    .slice()
    .sort((a, b) => {
      if (key(a) === key(b)) return 0;
      return key(a) < key(b) ? 1 : -1;
    })
    .map((t, key) => ({ ...t, key }));
};
