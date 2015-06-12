#Autodesk View and Data API sample using an ASP.NET Webform 

![](https://img.shields.io/badge/verified%20on-v1.2.15-green.svg)

##Description

This is a ASP.NET Webform sample providing functions to :

* Upload a file to a bucket.
* Start the translation of the file.
* Check translation progress.
* Load the translated file into the viewer. 

See the [live demo](http://checkoutmymodel.autodesk.io/).

##Dependencies

This sample uses the [RestSharp](http://restsharp.org/) and [log4net](http://logging.apache.org/log4net/index.html) libraries.  You can add them to your project using NuGet in Visual Studio. 

##Setup/Usage Instructions

* Get your consumer key and secret key from http://developer.autodesk.com.
* Run Visual Studio 2012 or 2013 and open ViewAndShare.sln
* Set the API keys in the Credentials.cs file.
* Change the bucket name for uploading files (also in the Credentials.cs file). The bucket name must match the pattern  “^[-_.a-z0-9]{3,128}$” - i.e. the bucket name must be between 3 to 128 characters long and contain only lowercase letters, numbers and the symbols ._–.  Bucket keys must be unique within the data center or region in which they were created. Therefore, to ensure uniqueness, we recommend you incorporate your company name/domain name or consumer public key (converted to lowercase) into the bucket name.
* Go to property of "ViewAndShare" web project, in "Web" tab, it uses "IIS Express", click "Create Virtual Directory". 
* Build the sample and launch the sample in a WebGL enabled browser like Google Chrome or Firefox.

You can get your model URN by clicking the 'Share' button, the urn is the parameter of sharing URL.
			
## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

##Written by 

Daniel Du





    
