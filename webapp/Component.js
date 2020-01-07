sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/upl/GSLabelPrint/model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("com.sap.upl.GSLabelPrint.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();

			var oModel = new JSONModel({
				busy: false,
				enablePrint: false,
				outputVisible: false,
				showbatch: false
			});
			this.setModel(oModel, "settingsModel");
			this.getModel("settingsModel").refresh();
			this.getModel("settingsModel").updateBindings();

			var gsData = new JSONModel({
				Material: "",
				Batch: "",
				Quantity: "",
				Nooflabel: "",
				Date: "",
				Warehouse: "",
				Printer: ""
			});
			this.setModel(gsData, "gsModel");
			this.getModel("gsModel").refresh();
			this.getModel("gsModel").updateBindings();

			this.setModel(models.createDeviceModel(), "device");
		}
	});
});