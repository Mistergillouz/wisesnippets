sap.ui.define([
  'sap/bi/webi/core/flux/core/Dispatcher',
  'sap/bi/smart/core/action/ActionRegistry',
  'sap/bi/webi/core/AbstractWorkbenchElement',
  'sap/bi/webi/core/flux/core/PropertiesAbstractStore',
  'sap/bi/smart/core/store/StoreRegistry',
  'sap/bi/webi/core/flux/core/HelperRegistry',
  'sap/bi/webi/jsapi/flux/constants/SecuredCommands'
], function ( // eslint-disable-line
  Dispatcher,
  ActionRegistry,
  AbstractWorkbenchElement,
  PropertiesAbstractStore,
  StoreRegistry,
  HelperRegistry,
  SecuredCommands
) {
  'use strict'

  const CenterCell = new AbstractWorkbenchElement({
    type: 'centerCell',
    tooltip: 'workbenchElement>centerCell/tooltip',
    text: 'workbenchElement>centerCell/text',
    icon: 'workbenchElement>centerCell/icon',
    enabled: 'workbenchElement>centerCell/enabled',
    visible: 'workbenchElement>centerCell/visible',
    rights: SecuredCommands.OPTIONAL_SECURITY_ID
  })

  //
  // LIFECYCLE
  //

  CenterCell.init = function () {
    StoreRegistry.getWorkbenchElementStore().addStoreProperty({
      name: this.getType(),
      type: PropertiesAbstractStore.propertyType.Object,
      invalidable: false,
      defaultValue: {
        text: 'workbench.actions.contextualMenu.centerCell',
        tooltip: 'workbench.actions.contextualMenu.centerCell.tooltip',
        icon: 'sap-icon://accept',
        enabled: true,
        visible: true
      }
    })

    Dispatcher.registerSuccess(
      CenterCell,
      ActionRegistry.LOAD_SELECTION_DATA,
      CenterCell.handleLoadSelectionDataSuccess,
      Dispatcher.Priority.LOW
    )
  }

  CenterCell.handleLoadSelectionDataSuccess = function (oEvent) {
    const viewContext = oEvent.actionParam.viewContext || oEvent.actionParam
    const infos = StoreRegistry.getWorkbenchElementStore().getCenterCell(viewContext)
    infos.enabled = false
    StoreRegistry.getWorkbenchElementStore().setCenterCell(viewContext, infos)
  }

  CenterCell.do = function (wiseViewId) { // eslint-disable-line
    HelperRegistry.getKeepAliveHelper().keepAlive({ wiseViewId })
    const viewContext = StoreRegistry.getWiseViewStore().getCurrentViewContext({ wiseViewId })
  }

  return CenterCell
})
