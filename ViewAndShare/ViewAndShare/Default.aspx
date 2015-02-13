﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ViewAndShare.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>View and Share </title>

    <!-- Bootstrap -->
    <link href="Content/bootstrap.min.css" rel="stylesheet" />

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Custom styles for this template -->
    <link href="Content/sticky-footer-navbar.css" rel="stylesheet" />

    <style>
        #box {
            width: 100%;
            height: 100px;
            text-align: center;
            vertical-align: middle;
            padding: 15px;
            font-family: Arial;
            font-size: 16px;
            border: 2px dashed #bbb;
            color: #bbb;
            background: #eee;
            margin-top: 10px;
            margin-bottom: 10px;
        }
    </style>






</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
    </form>


    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">CheckOutMyModel</a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="#">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>

    <div class="container">

        <div class="starter-template">
            <h1>Check out my model</h1>
            <p class="lead">
                Upload your model and share it with your friends.
              
            </p>

            <!-- Single button -->
            <div class="text-right" style="padding: 10px;">
                <div class="btn-group">
                    <!-- Toggle Buttons -->
                    <button type="button" class="btn btn-primary btn-lg"
                        data-toggle="collapse" data-target="#file-uploading">
                        Upload your files</button>


                    <button type="button" class="btn btn-success btn-lg dropdown-toggle" data-toggle="dropdown">
                        Share &nbsp; <span class="glyphicon glyphicon-share"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <li id="getThisLink"><a href="#">Share this link with friends</a></li>
                        <li id="getEmbededHtml" class="open-modal"><a href="#">Get embedded HTML code</a></li>
                        
                    </ul>
                </div>
            </div>

            <div id="file-uploading" class="collapse">
                <%--<input type="file" id="upload-files" name="file">--%>
                <div id="box">Drag & Drop files into this box.</div>
                
                <div class="text-right">
                    <button id="upload" type="button" class="btn btn-default btn-success">Upload</button>

                </div>

                <div id="alert_placeholder" style="padding: 10px">
                </div>

            </div>

            


        </div>

        <!-- Viewer container -->
        <div class="row">
            <div>
               
                <div id="viewerContainer" class="text-center" style="height: 600px; width: 1170px;">
                   
                </div>
            </div>

        </div>

    </div>




    <!-- Modal Contents Share with friends-->
    <div id="ShareModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">

                    <button type="button" class="close" data-dismiss="modal"
                        aria-hidden="true">
                        ×</button>

                    <h4 class="modal-title">Get embedded HTML</h4>
                </div>

                <div class="modal-body">
                    <p>Copy and paste following code snippet and embed it into your blog or your own web page</p>
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <div id="setting" class="control-group">
                                <div class="controls">
                                    Width:<input id="width" type="text" class="input-sm" value="800" />px
                                    Height:
                              <input id="height" type="text" class="input-sm" value="500" />px<br />
                                </div>
                            </div>
                            <div id="share_code" class="control-group">


                                <div class="form-group">
                                    <textarea id="share_code_box" class="form-control" rows="3">
                                    </textarea>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div class="modal-footer">
      
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>

            </div>
        </div>
    </div>

    <!-- Modal Contents Processing indicator-->
    <div class="modal fade" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1>Processing...</h1>
                </div>
                <div class="modal-body">
                    <div class="progress progress-striped active">
                        <div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                            <span class="sr-only">Uploading... Please be patient.</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>


    <div id="footer">
        <div class="container text-center">
            <p class="text-muted">Autodesk Developer Network</p>
        </div>
    </div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="Scripts/jquery-1.9.0.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="Scripts/bootstrap.min.js"></script>
    <script src="Scripts/modernizr-2.5.3.js"></script>

    <script src="http://code.jquery.com/ui/1.11.2/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.2/themes/start/jquery-ui.css" type="text/css"/>


<%--    <link rel="stylesheet" href="https://developer.api.autodesk.com/viewingservice/v1/viewers/style.css" type="text/css" />
    <script src="https://developer.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js"></script>--%>

    <link rel="stylesheet" href="https://developer-stg.api.autodesk.com/viewingservice/v1/viewers/style.css" type="text/css" />
    <script src="https://developer-stg.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js"></script>



    <script src="Scripts/viewer.js"></script>


    <script type="text/javascript">

        //var viewerEnv = "AutodeskProduction"; //AutodeskProduction,AutodeskStaging
        var viewerEnv = "AutodeskStaging"; //AutodeskProduction,AutodeskStaging

        $(document).ready(function () {

            var g_checkProgress = null;

            var g_urn = Autodesk.Viewing.Private.getParameterByName("urn");

            //default model
            if (!g_urn) {
                g_urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnVja2V0X2NoZWNrb3V0bXltb2RlbC9EcmlsbC5kd2Z4';
            }

            //init viewer and show the default model
            initializeViewer('viewerContainer', g_urn, viewerEnv);



            ////////////////////////////////////////////////
            //share to friends
            ////////////////////////////////////////////////
            $('#getEmbededHtml').click(function () {

                var height = $('#height').val();
                var width = $('#width').val();
                var shareUrl = getShareLink();

                var html = '<iframe src="' + shareUrl + '" style="height:' + height + 'px; width:' + width + 'px;" />';
                $('#share_code_box').val(html);

                $('#share_code_box').focus();
                $('#share_code_box').select();

                $('#ShareModal').modal('show');
            });

            $('#height').blur(function () {
                var height = $('#height').val();
                var width = $('#width').val();
                var shareUrl = getShareLink();

                var html = '<iframe src="' + shareUrl + '" style="height:' + height + 'px; width:' + width + 'px;" />';
                $('#share_code_box').val(html);
            });

            $('#width').blur(function () {
                var height = $('#height').val();
                var width = $('#width').val();
                var shareUrl = getShareLink();

                var html = '<iframe src="' + shareUrl + '" style="height:' + height + 'px; width:' + width + 'px;" />';
                $('#share_code_box').val(html);
            });


            $('#getThisLink').click(function () {
                var thisUrl = getShareLink();

                window.prompt("Copy to clipboard: Ctrl+C, Enter", thisUrl);

            });

            function getShareLink() {
                var url = window.location.href;
                //remove hash
                var idx = url.indexOf('#');
                if (idx > 0) {
                    url = url.substring(0, idx);
                }

                //add urn param
                var idx = url.indexOf('?');
                if (idx > 0) {
                    url = url.substring(0, idx);
                }
                return url + '?urn=' + g_urn;

            }

            ///////////////////////////////////////////
            // File upload
            ///////////////////////////////////////////
            //TODO: enable traditional way to upload files

            if (!Modernizr.draganddrop) {
                alert("This browser doesn't support File API and Drag & Drop features of HTML5!");
                return;
            }

            var box = document.getElementById("box");
            box.addEventListener("dragenter", OnDragEnter, false);
            box.addEventListener("dragover", OnDragOver, false);
            box.addEventListener("drop", OnDrop, false);


            $("#upload").click(function () {

                
                //$('#file-uploading').collapse();

                if (selectedFiles && selectedFiles.length > 0) {

                    //show the waiting dialogue
                    var waitDiv = $('#pleaseWaitDialog');
                    waitDiv.modal('show');

                    var data = new FormData();
                    for (var i = 0; i < selectedFiles.length; i++) {
                        data.append(encodeURIComponent(selectedFiles[i].name), selectedFiles[i]);
                    }

                    $.ajax({
                        type: "POST",
                        url: "FileUploadHandler.ashx",
                        contentType: false,
                        processData: false,
                        data: data,
                        success: function (result) {

                            //hide the waiting dialog
                            waitDiv.modal('hide');

                            //alert(result);
                            var json = JSON.parse(result);
                            if (json.urn) {

                                createAutoClosingAlert("You model is upload successfully. Translation starting...");

                                g_urn = json.urn;


                                checkProgress(g_urn);

                                //check progress periodically
                                g_checkProgress = window.setInterval(checkProgress, 10000, g_urn);

                            }//end if
                            else {
                                createAutoClosingAlert_Error("Error happened when uploading/translating, please try again latter.");

                            }//else if

                        }
                    })
                    .done(function () {

                    })
                    .fail(function () {
                        //hide the waiting dialog
                        waitDiv.modal('hide');

                        createAutoClosingAlert_Error("There was error uploading files!");

                    });







                }//end if

            });



            function checkProgress(urn) {

                var data = new FormData();
                data.append('urn', urn);

                $.ajax({
                    type: "POST",
                    url: "TranslationProgressHandler.ashx",
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (progress) {


                        //wait for success to view, actually you don't have to
                        if (progress != '' && progress === 'complete') {

                            window.clearInterval(g_checkProgress);
                            createAutoClosingAlert('Congratulations!! Translation is completed. ');


                            //start viewer
                            clearCurrentModel();
                            initializeViewer('viewerContainer', urn, viewerEnv);
                        }
                        else {

                            createAutoClosingAlert("Translation is in progress. " + progress + '. Why not keep playing with this one until the new model shows up?');

                        }
                    },
                    error: function () {
                        clearInterval(g_checkProgress);
                        createAutoClosingAlert_Error("Error when checking progress");
                    }

                });

                

            }





            function createAutoClosingAlert(message) {
                $('#alert_placeholder').html('<div id="alertDiv" class="alert alert-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message + '</div>');
                var alert = $('#alertDiv');
                window.setTimeout(function () { alert.alert('close'); }, 10000);
            }

            function createAutoClosingAlert_Error(message) {
                $('#alert_placeholder').html('<div id="alertDiv" class="alert alert-danger"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message + '</div>');
                var alert = $('#alertDiv');
                window.setTimeout(function () { alert.alert('close'); }, 10000);
            }

            function OnDragEnter(e) {
                e.stopPropagation();
                e.preventDefault();
            }

            function OnDragOver(e) {
                e.stopPropagation();
                e.preventDefault();
            }

            function OnDrop(e) {
                e.stopPropagation();
                e.preventDefault();
                selectedFiles = e.dataTransfer.files;

                // files is a FileList of File objects. List some properties.
                var output = [];
                for (var i = 0, f; f = selectedFiles[i]; i++) {
                    output.push('<li><strong>', encodeURIComponent(f.name), '</strong> (', f.type || 'application/stream', ') - ',
                                f.size, ' bytes, last modified: ',
                                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                                '</li>');
                }

                document.getElementById('box').innerHTML = '<ul>' + output.join('') + '</ul>';

                //$("#box").text(selectedFiles.length + " file(s) selected for uploading!");

            }




        });

    </script>



</body>
</html>
