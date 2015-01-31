///////////////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.seo
// by Daniel Du
//


//An example of custom tool config 

///////////////////////////////////////////////////////////////////////

//
//
//
// Example to use this extension:
//      
//        var options = {
//            urn : 'adfwersdafafaewf=a'
//        };
//      _viewer.loadExtension(
//             'Autodesk.ADN.Viewing.Extension.SEO', options);
//

///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.SEO = function (viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer);

    var _viewer = viewer;

    var _self = this;

    _self.load = function () {

        
        if (options.urn) {
            var urn = options.urn;

            if (urn.indexOf('urn:') !== 0)
                urn = 'urn:' + urn;

            _self.addSEO(urn);
        }
        


        console.log('Autodesk.ADN.Viewing.Extension.SEO loaded');

        return true;
    };



    _self.addSEO = function (documentId) {

        Autodesk.Viewing.Document.load(documentId,
            function(document) { // onLoadCallback
                var rootItem = document.getRootItem();
                
                var pageMap = propterisToPageMap(rootItem, document);
                console.group('SEO Extension');
                console.log(pageMap);
                console.groupEnd();

            },
            function(msg) { // onErrorCallback
              
                console.group('SEO error');
                console.error(msg);
                console.groupEnd();
            }


        );

       


    }

    _self.propterisToPageMap = function (node, document) {


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
            else
            {
                pageMapContent += propterisToPageMap(node, document);
            }
        }
        pageMapContent += '-->';
        return pageMapContent;

    }

    _self.unload = function () {


        console.log('Autodesk.ADN.Viewing.Extension.SEO unloaded');

        return true;
    };
};

Autodesk.ADN.Viewing.Extension.SEO.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.SEO.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.SEO;

Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.ADN.Viewing.Extension.SEO',
    Autodesk.ADN.Viewing.Extension.SEO);