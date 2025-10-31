const localeModules = import.meta.glob("./**/*.json", { eager: true });

export default Object.keys(localeModules).reduce((prev, key) => {
  const items = localeModules[key].default || localeModules[key];

  return {
    ...prev,
    ...items,
  };
}, {});
