'use strict';

//declare your namespaces
AutodeskNamespace('MyCommpany.Extensions');


MyCommpany.Extensions.BasicExtension = function (viewer) {

    Autodesk.Viewing.Extension.call(this, viewer);

}

MyCommpany.Extensions.BasicExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MyCommpany.Extensions.BasicExtension.prototype.constructor = MyCommpany.Extensions.BasicExtension;


var guidToNodeIdMapping = null;

function createGuidToNodeMapping(modelRoot, viewer) {
    var nodesToProcess = [];
    var currentGuidToNodeIdMapping = {};


    // Get all the nodes rooted at this model root.
    //
    function getAllNodes(root) {
        if (root.children) {
            for (var k = 0; k < root.children.length; k++) {
                var child = root.children[k];
                nodesToProcess.push(child);
                getAllNodes(child);
            }
        }
    }
    getAllNodes(modelRoot);
    function processNode(node, onNodeProcessed) {
        // Gets the property value for the given property name, if it exists.
        //
        function getPropertyValue(properties, propertyName) {
            for (var i = 0; i < properties.length; ++i) {
                var property = properties[i];
                
                ////for debugging
                //if (property.hidden) {
                //    console.log('[Hidden] - ' + property.displayName + ' : ' + property.displayValue);
                //} else {
                //    console.log(property.displayName + ' : ' + property.displayValue);
                //}

                if (property.displayName === propertyName) {
                    return property.displayValue;
                }
            }
            return null;
        }
        // When the properties are retrieved, map the node's guid to its id,
        // if the guid exists.
        //
        function onPropertiesRetrieved(result) {
            var guid = getPropertyValue(result.properties, 'Guid');
            if (guid) {
                currentGuidToNodeIdMapping[guid] = node.dbId;
                
            }
            
            onNodeProcessed();
        }
        // On error, move on to the next node.
        //
        function onError(status, message, data) {
            onNodeProcessed();
        }
        viewer.getProperties(node.dbId, onPropertiesRetrieved, onError);
    }
    // Process the nodes one by one.
    //
    function processNext() {
        if (nodesToProcess.length > 0) {
            processNode(nodesToProcess.shift(), processNext);
        } else {
            // No more nodes to process - the mappings are complete.
            //
            guidToNodeIdMapping = currentGuidToNodeIdMapping;
            
        }
    }
    processNext();
}


//extension load
MyCommpany.Extensions.BasicExtension.prototype.load = function () {

    console.log('MyCommpany.Extensions.BasicExtension is loaded');

    var viewer = this.viewer;
    

    //invoke this mapping creation when the geometry is loaded:
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (e) {
        if (viewer.model) {
            viewer.model.getObjectTree(function (root) {
                createGuidToNodeMapping(root, viewer);
            });
        }
    });

    //define a getNodeIdByGuid(guid) method like this on the viewer
    viewer.getNodeIdByGuid = function (guid) {
        if (guidToNodeIdMapping && guid in guidToNodeIdMapping) {
            return guidToNodeIdMapping[guid];
        }
        return null;
    };


    //just for test
    console.dir(viewer);

    viewer.addEventListener('selection', function (event) {
        var dbIdArray = event.dbIdArray;

        for (var i = 0; i < dbIdArray.length; i++) {

            var dbId = dbIdArray[i];

           
        }
    });

}

//extension unload
MyCommpany.Extensions.BasicExtension.prototype.unload = function () {

}

/**
 * Register the extension with the extension manager.
 */
Autodesk.Viewing.theExtensionManager.registerExtension('BasicExtension', MyCommpany.Extensions.BasicExtension);