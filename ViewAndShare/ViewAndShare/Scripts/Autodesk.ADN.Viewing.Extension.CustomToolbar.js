///////////////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.CustomToolbar
// by Daniel Du
//


//An example of custom tool config 

///////////////////////////////////////////////////////////////////////
//// custom toobar config 
//var toolbarConfig = {
//    'id': 'toolbar_id_1',
//    'containerId': 'toolbarContainer',
//    'subToolbars': [
//        {
//            'id': 'subToolbar_id_non_radio_1',
//            'isRadio': false,
//            'visible': true,
//            'buttons': [
//                {
//                    'id': 'buttonRotation',
//                    'buttonText': 'Rotation',
//                    'tooltip': 'Ratate the model at X direction',
//                    'cssClassName': 'glyphicon glyphicon glyphicon-play-circle',
//                    'iconUrl': 'Images/3d_rotation.png',
//                    'onclick': buttonRotationClick
//                },
//                {
//                    'id': 'buttonExplode',
//                    'buttonText': 'Explode',
//                    'tooltip': 'Explode the model',
//                    'cssClassName': '',
//                    'iconUrl': 'Images/explode_icon.jpg',
//                    'onclick': buttonExplodeClick
//                }
//
//            ]
//        },
//        {
//            'id': 'subToolbar_id_radio_1',
//            'isRadio': true,
//            'visible': true,
//            'buttons': [
//                {
//                    'id': 'radio_button1',
//                    'buttonText': 'radio_button1',
//                    'tooltip': 'this is tooltip for radio button1',
//                    'cssClassName': '',
//                    'iconUrl': '',
//                    'onclick': radioButton1ClickCallback
//                },
//                {
//                    'id': 'radio_button2',
//                    'buttonText': 'radio_button2',
//                    'tooltip': 'this is tooltip for radio button2',
//                    'cssClassName': '',
//                    'iconUrl': '',
//                    'onclick': radioButton2ClickCallback
//                }
//
//            ]
//        }
//    ]
//
//};
//
//
//
//function button2ClickCallback(e) {
//    alert('Button2 is clicked');
//}
//function radioButton1ClickCallback(e) {
//    alert('radio Button1 is clicked');
//}
//function radioButton2ClickCallback(e) {
//    alert('radio Button2 is clicked');
//}
//
//
//
// Example to use this extension:
//      
//      _viewer.loadExtension(
//             'Autodesk.ADN.Viewing.Extension.CustomToolbar', toolbarConfig);
//
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.CustomToolbar = function (viewer, toolbarConfig) {

    Autodesk.Viewing.Extension.call(this, viewer);

    var _viewer = viewer;

    var _self = this;

    _self.load = function () {

        _self.addCustomToolbar(toolbarConfig);


        console.log('Autodesk.ADN.Viewing.Extension.CustomToolbar loaded');

        return true;
    };



    _self.addCustomToolbar = function (toolbarConfig) {

        //find the container element in client webpage first
        var containter = document.getElementById(toolbarConfig.containerId);

        // if no toolbar container on client's webpage, create one and append it to viewer
        if (!containter) {
            containter = document.createElement('div');

            _viewer.clientContainer.appendChild(containter);

            containter.id = 'custom_toolbar';
            //'position: relative;top: 75px;left: 0px;z-index: 200;';
            containter.style.position = 'relative';
            containter.style.top = '75px';
            containter.style.left = '0px';
            containter.style.zIndex = '200';
            containter.style.width = _viewer.clientContainer.clientWidth + 'px';
            
        }
        //Need Jquery UI 
        $('#custom_toolbar').draggable();

        //create a toolbar
        var toolbar = new Autodesk.Viewing.UI.Toolbar(containter);

        for (var i = 0, len = toolbarConfig.subToolbars.length; i < len; i++) {
            var cfgSubToolbar = toolbarConfig.subToolbars[i];
            //create a subToolbar
            var subToolbar = toolbar.addSubToolbar(cfgSubToolbar.id, cfgSubToolbar.isRadio);
            subToolbar.setToolVisibility(cfgSubToolbar.visible);

            //create buttons
            for (var j = 0, len2 = cfgSubToolbar.buttons.length; j < len2; j++) {
                var cfgBtn = cfgSubToolbar.buttons[j];
                var button = Autodesk.Viewing.UI.Toolbar.createMenuButton(
                        cfgBtn.id,
                        cfgBtn.tooltip,
                        cfgBtn.onclick);

                ////set css calss if availible 
                //if (cfgBtn.cssClassName) {
                //    button.className = cfgBtn.cssClassName;
                //}
                //set button text if availible
                if (cfgBtn.buttonText) {
                    subToolbar.setToolText(button.id, cfgBtn.buttonText);
                }
                //add button to sub toolbar
                toolbar.addToSubToolbar(subToolbar.id, button);


                //set icon image if availible
                if (cfgBtn.iconUrl) {
                    subToolbar.setToolImage(button.id, cfgBtn.iconUrl);
                }
                
                
            }



        }


    }

    _self.unload = function () {

        $('#custom_toolbar').remove();

        console.log('Autodesk.ADN.Viewing.Extension.CustomToolbar unloaded');

        return true;
    };
};

Autodesk.ADN.Viewing.Extension.CustomToolbar.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.CustomToolbar.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.CustomToolbar;

Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.ADN.Viewing.Extension.CustomToolbar',
    Autodesk.ADN.Viewing.Extension.CustomToolbar);