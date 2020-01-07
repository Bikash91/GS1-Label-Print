sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (Controller, MessageBox, JSONModel, Device) {
	"use strict";

	return Controller.extend("com.sap.upl.GSLabelPrint.controller.GSPrint", {

		onInit: function () {
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("warehouse").focus();
			});
			this.path = "/sap/fiori/zgslabelprint/" + this.getOwnerComponent().getModel("soundModel").sServiceUrl +
				"/SoundFileSet('sapmsg1.mp3')/$value";
			this.onlyNumber(this.byId("ItemCode"));
			// this.onlyQuantity(this.byId("QuantityPerLabel"));
			// this.onlyNumber(this.byId("NoOfLabel"));

			this.byId("manFactureDate").addEventDelegate({
				onAfterRendering: function () {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, this.byId("manFactureDate"));

			this.byId("manFactureDate").setMaxDate(new Date());
		},

		onAfterRendering: function () {
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("warehouse").focus();
			});
			this.onlyNumber(this.byId("ItemCode"));
			// this.onlyQuantity(this.byId("QuantityPerLabel"));
			// this.onlyNumber(this.byId("NoOfLabel"));

			this.byId("manFactureDate").addEventDelegate({
				onAfterRendering: function () {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, this.byId("manFactureDate"));

			this.byId("manFactureDate").setMaxDate(new Date());
		},

		onWareHouseChange: function (oEvt) {
			this.getOwnerComponent().getModel("gsModel").setProperty("/Warehouse", oEvt.getSource().getSelectedKey());
			if (oEvt.getSource().getSelectedKey() != "") {
				oEvt.getSource().setValueState("None");
			}
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("ItemCode").focus();
			});
		},

		onlyNumber: function (element) {
			element.attachBrowserEvent("keydown", (function (e) {
				var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
				var isCursorMoveOrDeleteAction = ([46, 8, 37, 38, 39, 40, 9].indexOf(e.keyCode) !== -1);
				var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
				var vKey = 86,
					cKey = 67,
					aKey = 65;
				switch (true) {
				case isCursorMoveOrDeleteAction:
				case isModifierkeyPressed === false && isNumKeyPressed:
				case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey].indexOf(e.keyCode) !== -1):
					break;
				default:
					e.preventDefault();
				}
			}));
		},
		onlyQuantity: function (element) {
			element.attachBrowserEvent("keydown", (function (e) {
				var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
				var isCursorMoveOrDeleteAction = ([46, 8, 37, 38, 39, 40, 9, 190].indexOf(e.keyCode) !== -1);
				var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
				var vKey = 86,
					cKey = 67,
					aKey = 65;
				switch (true) {
				case isCursorMoveOrDeleteAction:
				case isModifierkeyPressed === false && isNumKeyPressed:
				case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey].indexOf(e.keyCode) !== -1):
					break;
				default:
					e.preventDefault();
				}
			}));
		},

		onCheckAllField: function (oEvt) {
			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
			}
			if (oEvt.getSource().getName() == "ItemCode") {
				if (oEvt.getSource().getValue() != "") {
					this.checkbatchmanaged(oEvt.getSource().getValue());
					/*jQuery.sap.delayedCall(400, this, function () {
						this.byId("LotNumber").focus();
					});*/
				}
			} else if (oEvt.getSource().getName() == "LotNumber") {
				if (oEvt.getSource().getValue() != "") {
					this.getOwnerComponent().getModel("gsModel").setProperty("/Batch", oEvt.getSource().getValue().toUpperCase());
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("QuantityPerLabel").focus();
					});
				}
			} else if (oEvt.getSource().getName() == "QuantityPerLabel") {
				if (oEvt.getSource().getValue() != "") {
					if (!(/^[0-9]+(\.[0-9]{1,2})?$/.test(oEvt.getSource().getValue()))) {
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"numericOnly"), {
								onClose: function (oAction) {
									if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("QuantityPerLabel").focus();
											this.getOwnerComponent().getModel("gsModel").setProperty("/Quantity", "");
										});
									}
								}.bind(this)
							});
						return;
					}
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("NoOfLabel").focus();
					});
				}
			} else if (oEvt.getSource().getName() == "NoOfLabel") {
				if (oEvt.getSource().getValue() != "") {
					if (!(/^\d+$/.test(oEvt.getSource().getValue()))) {
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"numericOnly"), {
								onClose: function (oAction) {
									if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("NoOfLabel").focus();
											this.getOwnerComponent().getModel("gsModel").setProperty("/Nooflabel", "");
										});
									}
								}.bind(this)
							});
						return;
					}
					jQuery.sap.delayedCall(400, this, function () {
						document.activeElement.blur();
					});
				}
			}

			var Material = this.getOwnerComponent().getModel("gsModel").getProperty("/Material");
			var Batch = this.getOwnerComponent().getModel("gsModel").getProperty("/Batch");
			var Quantity = this.getOwnerComponent().getModel("gsModel").getProperty("/Quantity");
			var Nooflabel = this.getOwnerComponent().getModel("gsModel").getProperty("/Nooflabel");
			var Date = this.getOwnerComponent().getModel("gsModel").getProperty("/Date");
			var Warehouse = this.getOwnerComponent().getModel("gsModel").getProperty("/Warehouse");

			if ((Material != "" && Quantity != "" && Nooflabel != "" && Date != "" && Warehouse != "") && (Batch == "" || Batch !=
					"")) {
				this.checkFieldMatWar(Material, Warehouse);
				//this.outputDevicVisible(Material, Batch, Quantity, Plant, Nooflabel, Date);
			}
		},

		checkbatchmanaged: function (value) {
			var Material = this.getOwnerComponent().getModel(
				"gsModel").getProperty("/Material");
			/*var Batch = this.getOwnerComponent().getModel(
				"gsModel").getProperty("/Batch");*/
			var Warehouse = this.getOwnerComponent().getModel(
				"gsModel").getProperty("/Warehouse");
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			var fieldFilter, filter = [];
			fieldFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material),
					new sap.ui.model.Filter("Warehouse", sap.ui.model.FilterOperator.EQ, Warehouse)
				],
				and: true
			});
			filter.push(fieldFilter);
			this.getOwnerComponent().getModel().read("/CheckBatchManagedSet", {
				filters: filter,
				success: function (oData, oResponse) {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					if (oData.results[0].Indicator == "X") {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/showbatch", true);
						jQuery.sap.delayedCall(400, this, function () {
							this.byId("LotNumber").focus();
						});
					} else {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/showbatch", false);
						jQuery.sap.delayedCall(400, this, function () {
							this.byId("QuantityPerLabel").focus();
						});
					}
				}.bind(this),
				error: function (error) {
					this.getErrorDetails(error, this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("error"));
				}.bind(this)
			});
		},

		labelPrint: function (oEvt) {

			if (this.byId("outputDevice").getSelectedKey() != "") {
				this.byId("outputDevice").setValueState("None");
			}

			var Material = this.getOwnerComponent().getModel("gsModel").getProperty("/Material");
			var Batch = this.getOwnerComponent().getModel("gsModel").getProperty("/Batch");
			var Quantity = this.getOwnerComponent().getModel("gsModel").getProperty("/Quantity");
			var Nooflabel = this.getOwnerComponent().getModel("gsModel").getProperty("/Nooflabel");
			var Date = this.getOwnerComponent().getModel("gsModel").getProperty("/Date");
			var Warehouse = this.getOwnerComponent().getModel("gsModel").getProperty("/Warehouse");
			var Printer = this.byId("outputDevice").getSelectedKey();

			var fieldFilter, filter = [];
			fieldFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material),
					new sap.ui.model.Filter("Batch", sap.ui.model.FilterOperator.EQ, Batch),
					new sap.ui.model.Filter("Quantity", sap.ui.model.FilterOperator.EQ, Quantity),
					new sap.ui.model.Filter("Nooflabel", sap.ui.model.FilterOperator.EQ, Nooflabel),
					new sap.ui.model.Filter("Date", sap.ui.model.FilterOperator.EQ, Date),
					new sap.ui.model.Filter("Warehouse", sap.ui.model.FilterOperator.EQ, Warehouse),
					new sap.ui.model.Filter("Printer", sap.ui.model.FilterOperator.EQ, Printer)
				],
				and: true
			});
			filter.push(fieldFilter);
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			this.getOwnerComponent().getModel().setUseBatch(false);
			this.getOwnerComponent().getModel().read("/QRCodeSet", {
				filters: filter,
				success: function (odata, oresponse) {
					sap.m.MessageToast.show("Printing in Process...", {
						duration: 5000
					});
					jQuery.sap.delayedCall(5000, this, function () {
						var gsData = new JSONModel({
							Material: "",
							Batch: "",
							Quantity: "",
							Nooflabel: "",
							Date: "",
							Warehouse: "",
							Printer: ""
						});
						this.getOwnerComponent().setModel(gsData, "gsModel");
						this.getOwnerComponent().getModel("gsModel").refresh();
						this.getOwnerComponent().getModel("gsModel").updateBindings();
						var model = new sap.ui.model.json.JSONModel();
						model.setData([]);
						this.getOwnerComponent().setModel(model, "printerModel");
						this.getOwnerComponent().getModel("printerModel").refresh();
						this.getOwnerComponent().getModel("settingsModel").setProperty("/outputVisible", false);
						this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
						this.getOwnerComponent().getModel("settingsModel").setProperty("/showbatch", false);
						jQuery.sap.delayedCall(400, this, function () {
							this.byId("warehouse").focus();
							this.byId("warehouse").setSelectedKey("");
						});
					});
				}.bind(this),
				error: function (oError) {
					this.getErrorDetails(oError, this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("unabletoprint"));
				}.bind(this)
			});
		},

		getErrorDetails: function (error, data) {
			var audio = new Audio(this.path);
			audio.play();
			jQuery.sap.delayedCall(5000, this, function () {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
			});
			if (JSON.parse(error.responseText).error.innererror.errordetails.length > 1) {
				var x = JSON.parse(error.responseText).error.innererror.errordetails;
				var details = '<ul>';
				var y = '';
				if (x.length > 1) {
					for (var i = 0; i < x.length - 1; i++) {
						y = '<li>' + x[i].message + '</li>' + y;
					}
				}
				details = details + y + "</ul>";

				MessageBox.error(data, {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					details: details,
					contentWidth: "100px",
					onClose: function (oAction) {
						if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {}
					}.bind(this)
				});
			} else {
				MessageBox.error(JSON.parse(error.responseText).error.message.value, {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					details: details,
					contentWidth: "100px",
					onClose: function (oAction) {
						if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {}
					}.bind(this)
				});
			}
		},

		getFormField: function (oFormContent) {
			var c = 0;
			for (var i = 0; i < oFormContent.length; i++) {
				if ((oFormContent[i].getMetadata()._sClassName === "sap.m.Input" || oFormContent[i].getMetadata()._sClassName ===
						"sap.m.DatePicker") && oFormContent[i].getVisible()) {
					if (oFormContent[i].getValue() == "") {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " + this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"isMan"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				} else if ((oFormContent[i].getMetadata()._sClassName === "sap.m.Select" || oFormContent[i].getMetadata()._sClassName ===
						"sap.m.ComboBox") && oFormContent[i].getVisible()) {
					if (oFormContent[i].getSelectedKey() == "") {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " + this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"isMan"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				}
			}
		},

		onChangeManufacturingDate: function (oEvt) {
			debugger;
			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
				// this.getOwnerComponent().getModel("gsModel").setProperty("/Date", oEvt.getParameter("value"));
			}

			var Material = this.getOwnerComponent().getModel("gsModel").getProperty("/Material");
			var Batch = this.getOwnerComponent().getModel("gsModel").getProperty("/Batch");
			var Quantity = this.getOwnerComponent().getModel("gsModel").getProperty("/Quantity");
			var Nooflabel = this.getOwnerComponent().getModel("gsModel").getProperty("/Nooflabel");
			var Date = this.getOwnerComponent().getModel("gsModel").getProperty("/Date");
			var Warehouse = this.getOwnerComponent().getModel("gsModel").getProperty("/Warehouse");
			if ((Material != "" && Quantity != "" && Nooflabel != "" && Date != "" && Warehouse != "") && (Batch == "" || Batch !=
					"")) {
				this.checkFieldMatWar(Material, Warehouse);
				//this.outputDevicVisible(Material, Batch, Quantity, Nooflabel, Date, Warehouse);
			}
		},
		checkFieldMatWar: function (Material, Warehouse) {
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			var fieldFilter, filter = [];
			fieldFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material),
					new sap.ui.model.Filter("Warehouse", sap.ui.model.FilterOperator.EQ, Warehouse)
				],
				and: true
			});
			filter.push(fieldFilter);
			this.getOwnerComponent().getModel().read("/CheckBatchManagedSet", {
				filters: filter,
				success: function (oData, oResponse) {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					var data = oData.results[0];
					var id;
					if (data.Type == 'E') {
						var audio = new Audio(this.path);
						audio.play();
						jQuery.sap.delayedCall(5000, this, function () {
							this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
							MessageBox.error(data.Message, {
								onClose: function (oAction) {
									if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
										if (data.INDICATOR == 'Material') {
											this.getOwnerComponent().getModel("gsModel").setProperty("/Material", "");
											id = "ItemCode";
										} else if (data.INDICATOR == 'Warehouse') {
											this.getOwnerComponent().getModel("gsModel").setProperty("/Warehouse", "");
											id = "warehouse";
										}
										jQuery.sap.delayedCall(400, this, function () {
											this.byId(id).focus();
										});
									}
								}.bind(this)
							});
						});
					} else {
						this.outputDevicVisible();
					}
				}.bind(this),
				error: function (error) {
					this.getErrorDetails(error, this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("error"));
				}.bind(this)
			});
		},

		outputDevicVisible: function () {
			var fieldFilter, filter = [];
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			fieldFilter = new sap.ui.model.Filter({
				filters: [new sap.ui.model.Filter("Warehouse", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("gsModel").getProperty(
					"/Warehouse"))],
				and: true
			});
			filter.push(fieldFilter);
			this.getOwnerComponent().getModel().read("/PRINTERLISTSet", {
				filters: filter,
				success: function (oData) {

					var model = new sap.ui.model.json.JSONModel();
					model.setData(oData);
					this.getOwnerComponent().setModel(model, "printerModel");
					this.getOwnerComponent().getModel("printerModel").refresh();
					this.getOwnerComponent().getModel("settingsModel").setProperty("/outputVisible", true);
					this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePrint", true);
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);

					if (oData.results[0].PRINTER == "X") {
						this.getOwnerComponent().getModel("gsModel").setProperty("/Printer", oData.results[0].PRINTER);
					}

					this.getOwnerComponent().getModel("gsModel").refresh();

				}.bind(this),
				error: function (oError) {}.bind(this)
			});

		},

		dateFormatter: function (oValue) {
			if (oValue !== null) {
				var date = oValue;
				var m = String(date).slice(4, 15).replace(/ /g, "/").slice(0, 3);
				var d = String(date).slice(4, 15).replace(/ /g, "/").slice(4, 6);
				var y = String(date).slice(4, 15).replace(/ /g, "/").slice(7, 15);
				switch (m) {
				case 'Jan':
					m = "01";
					break;
				case "Feb":
					m = "02";
					break;
				case "Mar":
					m = "03";
					break;
				case "Apr":
					m = "04";
					break;
				case "May":
					m = "05";
					break;
				case "Jun":
					m = "06";
					break;
				case 'Jul':
					m = "07";
					break;
				case "Aug":
					m = "08";
					break;
				case "Sep":
					m = "09";
					break;
				case "Oct":
					m = "10";
					break;
				case "Nov":
					m = "11";
					break;
				case "Dec":
					m = "12";
					break;
				default:
					break;
				}
				return "datetime'" + y + "-" + m + "-" + d + "T00:00:00'";
			}

		},

		onPressPrint: function () {
			var count = this.getFormField(this.byId("idGs").getContent());
			if (count > 0) {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
				jQuery.sap.delayedCall(400, this, function () {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle()
						.getText(
							"allMandatory"));
				});
				return;
			}

			var Material = this.getOwnerComponent().getModel("gsModel").getProperty("/Material");
			var Batch = this.getOwnerComponent().getModel("gsModel").getProperty("/Batch");
			var Quantity = this.getOwnerComponent().getModel("gsModel").getProperty("/Quantity");
			var Nooflabel = this.getOwnerComponent().getModel("gsModel").getProperty("/Nooflabel");
			var Date = this.getOwnerComponent().getModel("gsModel").getProperty("/Date");
			var Warehouse = this.getOwnerComponent().getModel("gsModel").getProperty("/Warehouse");
			var Printer = this.byId("outputDevice").getSelectedKey();
			if ((Material != "" && Quantity != "" && Nooflabel != "" && Date != "" && Warehouse != "" && Printer != "") && (Batch == "" ||
					Batch !=
					"")) {
				this.labelPrint();
			}
		}

	});

});