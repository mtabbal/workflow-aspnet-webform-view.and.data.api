
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
                    'buttonText': 'Rotation',
                    'tooltip': 'Ratate the model at X direction',
                    'cssClassName': 'glyphicon glyphicon glyphicon-play-circle',
                    'iconUrl': 'Images/3d_rotation.png',
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
                    'iconUrl': 'Images/adsk.24x24.png',
                    'onclick': radioButton1ClickCallback
                },
                {
                    'id': 'radio_button2',
                    'buttonText': 'radio_button2',
                    'tooltip': 'this is tooltip for radio button2',
                    'cssClassName': '',
                    'iconUrl': 'Images/adsk.32x32.png',
                    'onclick': radioButton2ClickCallback
                }

            ]
        }
    ]

};

var rotationActive;
function buttonRotationClick(e) {

    alert('Button Rotation is clicked');


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
    startMouseTracking(true);

}
function radioButton2ClickCallback(e) {
    alert('radio Button2 is clicked');

}


function startMouseTracking(start) {
    if (start) {

        _viewer.addEventListener('mousemove', onViewerMouseMove);
        _viewer.addEventListener('mousedown', onViewerMouseDown);
        _viewer.addEventListener('mouseup', onViewerMouseUp);

    } else {
        //window.onmousemove = function (event) { };
        _viewer.removeEventListener('mousemove');
        _viewer.removeEventListener('mousedown');
        _viewer.removeEventListener('mouseup');
    }

    function onViewerMouseMove(event) {
        event = event || window.event; //IE
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        var mouseZ = 0;

        console.log("x " + mouseX + " y " + mouseY);
    }

    function onViewerMouseDown(event) {

    }

    function onViewerMouseUp(event) {

    }
}
////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function createViewer(containerId, urn, viewerEnv) {


    if (typeof (viewerEnv) == "undefined") {
        viewerEnv = "AutodeskProduction";
    }

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

    var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement,
            {
                //extensions: ['SomeExtension']
            }
        );
  
    //As a best practice, access token should be generated from server side
    $.getJSON('GetAccessToken.ashx', function (data) {

        var accessToken = data.access_token;

        var options = {
            'env': viewerEnv, //By default, it is AutodeskProduction 
            'accessToken': accessToken,
            'document': urn,
            'refreshToken': getAccessToken   //refresh token when token expires
        };

        Autodesk.Viewing.Initializer(options, function () {

            viewer.start();

            loadDocument(viewer, options.document);

            
        });

    })
    .done(function () { })
    .fail(function (jqXHR, textStatus, errorThrown) {
        //alert('getJSON request failed! ' + textStatus);
    })
    .always();


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

    return viewer;
}

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function loadDocument(viewer, documentId) {

    // Find the first 3d geometry and load that.
    Autodesk.Viewing.Document.load(documentId,
        function (doc) {// onLoadCallback

            var rootItem = doc.getRootItem();
            var geometryItems = [];

            //check 3d first
            geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(rootItem, {
                'type': 'geometry',
                'role': '3d'
            }, true);

            //no 3d geometry, check 2d
            if (geometryItems.length == 0) {
                geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(rootItem, {
                    'type': 'geometry',
                    'role': '2d'
                }, true);
            }

            //load the first gemoetry 
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


 function propterisToPageMap(node, document) {


    var pageMapContent = '<!--';
    for (var property in node) {
        if (property !== 'children') {
            if (property === 'hasThumbnail' && node[property] === 'true') {
                pageMapContent += '<tr><td><b>Thumbnail</b></td><td><img src="' + document.getThumbnailPath(node, 300, 300) + '"></img></td></tr>';
            }
            else {
                pageMapContent += '<DataObject type="action">';
                pageMapContent += '  <Attribute name="' + property + '" value="' + node[property] + '"/>';
                pageMapContent += '</DataObject>';
            }
        }
        else {
           
            for (var i = 0; i < node[property].length; i++) {
                var child = node[property][i];
                pageMapContent += propterisToPageMap(child, document);
            }
            
        }
    }
    pageMapContent += '-->';
    return pageMapContent;

}



///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function getPropertyValue(viewer, dbId, propName, callback) {

    function propsCallback(result) {

        if (result.properties) {

            for (var i = 0; i < result.properties.length; i++) {

                var prop = result.properties[i];

                if (prop.displayName === propName) {

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


 
    }


}


///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function initializeViewer(containerId, urn, viewerEnv) {

    if (typeof (viewerEnv) == "undefined") {
        viewerEnv = "AutodeskProduction";
    }

    _viewer = createViewer(containerId, urn, viewerEnv);

    _viewer.addEventListener('selection', onViewerItemSelected)

    ////extension way
    //_viewer.loadExtension('Autodesk.ADN.Viewing.Extension.CustomToolbar', toolbarConfig);

    ////load SEO extension
    //var options = {
    //    urn : urn
    //            };
    //_viewer.loadExtension('Autodesk.ADN.Viewing.Extension.SEO', options);
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

