var _auth;
var _viewer;

/////////////////////////////////////////////////////////////////////
// custom toobar config 
var toolbarConfig = {
    'id': 'toolbar_id_1',
    'containerId': 'toolbarContainer',
    'subToolbars': [
        {
            'id': 'subToolbar_id_non_radio_1',
            'isRadio': false,
            'visible': true,
            'buttons': [
                {
                    'id': 'buttonRotation',
                    'buttonText' : 'Rotation',
                    'tooltip': 'Ratate the model at X direction',
                    'cssClassName': 'glyphicon glyphicon glyphicon-play-circle',
                    'iconUrl' :'Images/3d_rotation.png',
                    'onclick': buttonRotationClick
                },
                {
                    'id': 'buttonExplode',
                    'buttonText': 'Explode',
                    'tooltip': 'Explode the model',
                    'cssClassName': '',
                    'iconUrl': 'Images/explode_icon.jpg',
                    'onclick': buttonExplodeClick
                }

            ]
        },
        {
            'id': 'subToolbar_id_radio_1',
            'isRadio': true,
            'visible': true,
            'buttons': [
                {
                    'id': 'radio_button1',
                    'buttonText': 'radio_button1',
                    'tooltip': 'this is tooltip for radio button1',
                    'cssClassName': '',
                    'iconUrl': '',
                    'onclick': radioButton1ClickCallback
                },
                {
                    'id': 'radio_button2',
                    'buttonText': 'radio_button2',
                    'tooltip': 'this is tooltip for radio button2',
                    'cssClassName': '',
                    'iconUrl': '',
                    'onclick': radioButton2ClickCallback
                }

            ]
        }
    ]

};

var rotationActive;
function buttonRotationClick(e) {

    if (rotationActive == undefined) {

        rotationActive = setInterval(function () {
            var cam = _viewer.getCamera();
            //rotate 1 degree
            //cam.rotation.order = 'YXZ'
            //cam.rotateOnAxis((new THREE.Vector3(0, 1, 0)).normalize(), degInRad(1));

            //cam.rotation.x += degInRad(1);

            var xStep = 30;
            cam.translateX(xStep);
            _viewer.applyCamera(cam,false);


        }, 100);
    }
    else {
        clearInterval(rotationActive);
        rotationActive = undefined;
    }
}

function degInRad(deg) {
    return deg * Math.PI / 180;
}  

var explodeActive;
function buttonExplodeClick() {
    var explodeFraction = 0;
    var explodeIncrement = 0.01;
    if (explodeActive == undefined) {
        explodeActive = setInterval(function () {
            explodeFraction += explodeIncrement;
            if ((explodeFraction > 1.0) || (explodeFraction < 0.0)) {
                explodeIncrement = -explodeIncrement;
                explodeFraction += explodeIncrement;
            }
            _viewer.explode(explodeFraction);

        }, 100);
    }
    else {
        clearInterval(explodeActive);
        explodeActive = undefined;
    }

}

function button2ClickCallback(e) {
    alert('Button2 is clicked');
}
function radioButton1ClickCallback(e) {
    alert('radio Button1 is clicked');
}
function radioButton2ClickCallback(e) {
    alert('radio Button2 is clicked');
}
////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function createViewer(containerId, urn) {

    if (urn.indexOf('urn:') !== 0)
        urn = 'urn:' + urn;

    var viewerContainer = document.getElementById(containerId);

    var viewerElement = document.createElement("div");

    viewerElement.id = 'viewer3d';
    ////by percentage does not work
    //viewerElement.style.height = '100%';
    //viewerElement.style.width = '100%';
    //rember the 'px' at the end of height/width
    //as style.width and style.height actually takes a string
    viewerElement.style.height = viewerContainer.clientHeight + 'px';
    viewerElement.style.width = viewerContainer.clientWidth + 'px';
    viewerElement.style.position = 'absolute'; // this is a must
    viewerContainer.appendChild(viewerElement);



    var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
    //var viewer = new Autodesk.Viewing.Viewer3D(viewerElement, {});

    //As a best practice, access token should be generated from server side
    $.getJSON('/GetAccessToken.ashx', function (data) {

        var accessToken = data.access_token;

        var options = {
            //'env': 'AutodeskProduction', //By default, it is AutodeskProduction 
            'accessToken': accessToken,
            'document': urn,
            'refreshToken': getAccessToken   //refresh token when token expires
        };

        Autodesk.Viewing.Initializer(options, function () {
            viewer.initialize();

            loadDocument(viewer, null, options.document);
        });

    })
    .done(function () { })
    .fail(function (jqXHR, textStatus, errorThrown) {
        //alert('getJSON request failed! ' + textStatus);
    })
    .always();



    viewer.addEventListener('selection', onViewerItemSelected);


    //add custom toolbar 
    addToolbar(toolbarConfig, viewer);


    // disable scrolling on DOM document 
    // while mouse pointer is over viewer area
    $('#viewer3d').hover(
        function () {
            var scrollX = window.scrollX;
            var scrollY = window.scrollY;
            window.onscroll = function () {
                window.scrollTo(scrollX, scrollY);
            };
        },
        function () {
            window.onscroll = null;
        }
    );

    // disable default context menu on viewer div 
    $('#viewer3d').on('contextmenu', function (e) {
        e.preventDefault();
    });

    _viewer = viewer;
    return viewer;
}

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function loadDocument(viewer, auth, documentId) {

    //var path = VIEWING_URL + '/bubbles/' + documentId.substr(4);
    //var path = VIEWING_URL + '/' + documentId.substr(4);
    var path = documentId;

    // Find the first 3d geometry and load that.
    Autodesk.Viewing.Document.load(path, auth,
        function (doc) {// onLoadCallback

            var geometryItems = [];
            geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
                'type': 'geometry',
                'role': '3d'
            }, true);

            if (geometryItems.length > 0) {
                viewer.load(doc.getViewablePath(geometryItems[0]),
                    null,           //sharedPropertyDbPath
                    function () {   //onSuccessCallback
                        //alert('viewable are loaded successfully');
                    },
                    function () {   //onErrorCallback
                        //alert('viewable loading failded');
                    }
                );
            }
        }, function (errorMsg) {// onErrorCallback
            alert("Load Error: " + errorMsg);
        });
}


///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function getPropertyValue(viewer, dbId, name, callback) {

    function propsCallback(result) {

        if (result.properties) {

            for (var i = 0; i < result.properties.length; i++) {

                var prop = result.properties[i];

                if (prop.displayName == name) {

                    callback(prop.displayValue);
                }
            }

            callback('');
        }
    }

    viewer.getProperties(dbId, propsCallback);
}

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function clearCurrentModel() {

    var viewerElement = document.getElementById('viewer3d');
    if (viewerElement != null) {
        viewerElement.parentNode.removeChild(viewerElement);
    }
    
}


///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function onGeometryLoaded(event) {

    _viewer.removeEventListener(
        Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        onGeometryLoaded);

    _viewer.getObjectTree(function (rootComponent) {

        _viewer.docstructure.handleAction(
            ["focus"],
            rootComponent.dbId);
    });
}



///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function onViewerItemSelected(event) {

    var dbIdArray = event.dbIdArray;

    for (var i = 0; i < dbIdArray.length; i++) {

        var dbId = dbIdArray[i];

        //alert(dbId);

    }

    
}


///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function initializeViewer(containerId, urn) {

       
       _viewer = createViewer(containerId, urn);

    
}


///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function getThumbnail(urn) {

}

//////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function getAccessToken() {
    // This method should fetch token from a service if the current token has expired
    // it might be something like:
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "GetAccessToken.ashx", false);
    xmlHttp.send(null);
    var data = xmlHttp.responseText;

    var newToken = JSON.parse(data).access_token;
    return newToken;
}

////////////////////////////////////////////////////////////////////////////
////
////
/////////////////////////////////////////////////////////////////////////////
//function addToolBar(container) {
//    //create a toolbar
//    var toolbar = new Autodesk.Viewing.UI.ToolBar(container);

//    //create a subToolbar
//    var subToolbar = toolbar.addSubToolbar('sub1');

//    //add some  buttons to it
//    var button1 = Autodesk.Viewing.UI.ToolBar.createMenuButton("Button1",
//        "Tooltip for Button1",
//        function (e) {
//            alert("Button1 is clicked.");
//        });

//    //add icon for the button
//    button1.className = 'glyphicon glyphicon-euro';

//    var button2 = Autodesk.Viewing.UI.ToolBar.createMenuButton("Button2",
//        "Tool tip for Button2",
//        function (e) {
//            alert("Button2 is clicked");
//        });
//    //Add buttons to subtoolbar
//    toolbar.addToSubToolbar("sub1", button1);
//    toolbar.addToSubToolbar("sub1", button2);


//    //create a radio sub toolbar
//    var radioSubToolbar = toolbar.addSubToolbar('radioSub2', true); //id, isRadio
    
//    // add some buttons to it
//    var button3 = Autodesk.Viewing.UI.ToolBar.createMenuButton("Button3",
//        "Tool tip for Button3",
//        function (e) {
//            alert("Button2 is clicked");
//        });
//    var button4 = Autodesk.Viewing.UI.ToolBar.createMenuButton("Button4",
//        "Tool tip for Button4",
//        function (e) {
//            alert("Button4 is clicked");
//        });

//    //add buttons to radioSubToolbar
//    toolbar.addToSubToolbar("radioSub2", button3);
//    toolbar.addToSubToolbar("radioSub2", button4);


//}




//////////////////////////////////////////////////////////////////////////////////
// Add custom toolbar, here is an example toolbar config, 
// Using the toolbar config to centralize the toolbar setting

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
//                    'id': 'button1',
//                    'tooltip': 'this is tooltip for button1',
//                    'cssClassName': 'glyphicon glyphicon-euro', //bootstrap
//                    'onclick': button1ClickCallback
//                },
//                {
//                    'id': 'button2',
//                    'tooltip': 'this is tooltip for button2',
//                    'cssClassName': '',
//                    'onclick': button2ClickCallback
//                }

//            ]
//        },
//        {
//            'id': 'subToolbar_id_radio_1',
//            'isRadio': true,
//            'visible': true,
//            'buttons': [
//                {
//                    'id': 'radio_button1',
//                    'tooltip': 'this is tooltip for radio button1',
//                    'cssClassName': '',
//                    'onclick': radioButton1ClickCallback
//                },
//                {
//                    'id': 'radio_button2',
//                    'tooltip': 'this is tooltip for radio button2',
//                    'cssClassName': '',
//                    'onclick': radioButton2ClickCallback
//                }

//            ]
//        }
//    ]

//};

////add custom toolbar 
//addToolbar(toolbarConfig);

////////////////////////////////////////////////////////////////////////////
function addToolbar(toolbarConfig, viewer) {

    //find the container element in client webpage first
    var containter = document.getElementById(toolbarConfig.containerId);

    // if no toolbar container on client's webpage, create one and append it to viewer
    if (!containter) {
        containter = document.createElement('div');
        containter.id = 'custom_toolbar';
        //'position: relative;top: 75px;left: 0px;z-index: 200;';
        containter.style.position = 'relative';
        containter.style.top = '75px';
        containter.style.left = '0px';
        containter.style.zIndex= '200';
        viewer.clientContainer.appendChild(containter);
    }

    //create a toolbar
    var toolbar = new Autodesk.Viewing.UI.ToolBar(containter);

    for (var i = 0, len = toolbarConfig.subToolbars.length; i < len; i++) {
        var stb = toolbarConfig.subToolbars[i];
        //create a subToolbar
        var subToolbar = toolbar.addSubToolbar(stb.id, stb.isRadio);
        subToolbar.setToolVisibility(stb.visible);

        //create buttons
        for (var j = 0, len2 = stb.buttons.length; j < len2; j++) {
            var btn = stb.buttons[j];
            var button = Autodesk.Viewing.UI.ToolBar.createMenuButton(btn.id, btn.tooltip, btn.onclick);
            //set css calss if availible 
            if (btn.cssClassName) {
                button.className = btn.cssClassName;
            }
            //set button text if availible
            if (btn.buttonText) {
                var btnText = document.createElement('span');
                btnText.innerText = btn.buttonText;
                button.appendChild(btnText);
            }
            //set icon image if availible
            if (btn.iconUrl) {
                var ico = document.createElement('img');
                ico.src = btn.iconUrl;
                ico.className = 'toolbar-button';
                button.appendChild(ico);
            }
            //add button to sub toolbar
            toolbar.addToSubToolbar(stb.id, button);

        }



    }

  



}