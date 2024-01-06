WorkbenchController.prototype._dumpStore = function () {
  debugger;
  // eslint-disable-next-line quotes
  const storesList = [
    'documentStore',
    'workbenchStore',
    'interactionStore',
    'reportElementStore',
    'reportStore',
    'dataObjectStore',
    'dataProviderStore',
    'documentInputControlStore',
    'reportInputControlStore',
    'workbenchElementStore',
    'configurationStore',
    'viewStore',
    'alerterStore',
    'commentStore',
    'documentInfosStore',
    'drillerFilterStore',
    'pageStore',
    'sessionStore',
    'sortStore',
    'variantStore',
    'webAppInfoStore',
    'webiStore',
    'elementLinkStore',
    'featureToggleStore',
    'fullScreenStore',
    'wiseAppStore',
    'wiseViewStore',
    'workbenchErrorStore',
    'workbenchFilterBarStore',
    'workbenchSnapshotStore',
    'workbenchWarningStore',
    'CmsItemStore',
    'dataModelStore',
  ];

  const stores = {};
  storesList.forEach((name) => {
    const storeName = name.charAt(0).toUpperCase() + name.substring(1);
    const store = StoreRegistry[`get${storeName}`]();
    if (store instanceof PropertiesAbstractStore) {
      Object.keys(store)
        .filter((key) => typeof store[key] === 'function')
        .filter((key) => !key.endsWith('Key'))
        .filter((key) => key.startsWith('get') || key.startsWith('register'))
        .forEach((storeKey) => {
          if (!stores[storeName]) {
            stores[storeName] = [];
          }
          stores[storeName].push(storeKey);
        });
    } else {
      const data = store.getData('/');
      stores[storeName] = Object.keys(data).map((key) => key);
    }

    if (stores[storeName].length) {
      stores[storeName].sort();
      stores[storeName] = `|${stores[storeName].join(',')}|`;
    } else {
      delete stores[storeName];
    }
  });

  const helpers = Object.values(HelperRegistry.getObjects()).map((object) => object.getType());
  console.log(
    JSON.stringify({
      stores,
      helpers,
      actions: Object.keys(ActionRegistry).filter((key) => key === key.toUpperCase()),
    })
  );
};
