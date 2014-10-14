'use strict';

AutodeskNamespace('Autodesk.Samples');

/**
 * SampleContextMenu demonstrates how you might take the existing ViewerObjectContextMenu
 * and customize that. If you want an entirely different context menu, then derive from
 * ObjectContextMenu instead.
 */
Autodesk.Samples.SampleContextMenu = function (viewer) {
    Autodesk.Viewing.Extensions.ViewerObjectContextMenu.call(this, viewer);
};

Autodesk.Samples.SampleContextMenu.prototype = Object.create(Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype);
Autodesk.Samples.SampleContextMenu.prototype.constructor = Autodesk.Samples.SampleContextMenu;

Autodesk.Samples.SampleContextMenu.prototype.buildMenu = function (event, status) {
    var menu =  Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype.buildMenu.call(this, event, status);

    function shuffle(o) { // from Stackoverflow
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    // Make some arbitrary changes to the menu: shuffle the menu items, delete the first one, and add one.
    //
    if (1 < menu.length) {
        shuffle(menu);
        menu.splice(0, 1);
    }

    menu.push({
        title: "An extra menu item",
        target: function () {
            alert("The extra menu item was clicked");
        }
    });

    return menu;
};

///**
// * SampleLayersPanel demonstrates how you might customize the LayersPanel.
// * @class
// * @param {Viewer} viewer
// * @constructor
// */
//Autodesk.Samples.SampleLayersPanel = function (viewer) {
//    Autodesk.Viewing.UI.LayersPanel.call(this, viewer);
//};

//Autodesk.Samples.SampleLayersPanel.prototype = Object.create(Autodesk.Viewing.UI.LayersPanel.prototype);
//Autodesk.Samples.SampleLayersPanel.prototype.constructor = Autodesk.Samples.SampleLayersPanel;

/**
 * SampleExtension sets the SampleModelStructurePanel and SampleLayersPanel to the given viewer
 * and registers hotkeys to toggle their display.  It also sets a SampleContextMenu.
 */
Autodesk.Samples.SampleExtension = function (viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.modelStructurePanel = null;
};

Autodesk.Samples.SampleExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
Autodesk.Samples.SampleExtension.prototype.constructor = Autodesk.Samples.SampleExtension;

/**
 * Override load to create the SampleModelStructurePanel and SampleLayersPanel,
 * set them on the viewer, and register hotkeys. It also creates the SampleContextMenu.
 */
Autodesk.Samples.SampleExtension.prototype.load = function () {
    var that = this;

    that.modelStructurePanel = new Autodesk.Samples.SampleModelStructurePanel(that.viewer, 'Sample Model Structure Loading', that.options);
    that.viewer.setModelStructurePanel(that.modelStructurePanel);

    //that.layersPanel = new Autodesk.Samples.SampleLayersPanel(that.viewer);
    //that.viewer.setLayersPanel(that.layersPanel);

    that.viewer.setContextMenu(new Autodesk.Samples.SampleContextMenu(that.viewer));

    that.onKeyDown = function (e) {
        if (e.keyCode === 77) { // 'm' hotkey to show/hide model structure panel
            if (!that.viewer.model.is2d()) {
                that.modelStructurePanel.setVisible(!that.modelStructurePanel.isVisible());
            }

        } else if (e.keyCode === 76) { // 'l' hotkey to show/hide layers panel
            if (that.viewer.model.is2d()) {
                that.layersPanel.setVisible(!that.layersPanel.isVisible());
            }
        }
    };
    window.addEventListener('keydown', that.onKeyDown, false);

    // Override some settings with extension-specific values.
    //
    this.viewer.setGhosting(false);

    return true;
};

/**
 * Override unload to remove the SampleModelStructurePanel, SampleLayersPanel,
 * and SampleContextMenu from the viewer, and unregister the hotkeys.
 */
Autodesk.Samples.SampleExtension.prototype.unload = function () {
    // Remove the panel from the viewer.
    //
    this.viewer.setModelStructurePanel(null);
    this.viewer.setLayersPanel(null);
    this.viewer.setContextMenu(null);

    // Remove the event listener for the hotkey.
    //
    window.removeEventListener('keydown', this.onKeyDown);
    return true;
};

/**
 * Register the extension with the extension manager.
 */
Autodesk.Viewing.theExtensionManager.registerExtension('SampleExtension', Autodesk.Samples.SampleExtension);
