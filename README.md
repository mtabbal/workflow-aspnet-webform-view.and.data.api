#Autodesk View and Data API workflow sample in ASP.NET Webform 


##Description

*This sample is part of the [Developer-Autodesk/Autodesk-View-and-Data-API-Samples](https://github.com/Developer-Autodesk/autodesk-view-and-data-api-samples) repository.*

This is a sample ASP.NET Webform sample providing functions to :

* Upload a file to bucket
* Start translation
* Check translation progress
* Load it in Viewer. 

##Dependencies

This sample uses the [RestSharp](http://restsharp.org/) library. You can add it to your project using NuGet in Visual Studio.

##Setup/Usage Instructions

* Get your consumer key and secret key from http://developer.autodesk.com
* Set the API keys in the Credentials.cs file
* Change the bucket name for uploading files (also in the Credentials.cs file), the bucket name should only include characters, numbers in lower case and underscore(_). [As the name must be unique, we recommend you include your public key token in the name].

* Please note that you may get "Load Error: 5" error for the time when you launch the application, this is an expected behaviour. The reason is the application tries to load the default model which is uploaded previously while you do not have the permission to access it when you replace the consumer key and secret key. Ignore this error message and try to upload your models. 

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

##Written by 

Daniel Du





    
