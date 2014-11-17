using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using ViewerUtil;
using ViewerUtil.Models;

namespace ViewAndShare
{
    /// <summary>
    /// Summary description for FileUploadHandler
    /// </summary>
    public class FileUploadHandler : IHttpHandler, IRequiresSessionState
    {
        static string BASE_URL = ConfigurationManager.AppSettings.Get("BASE_URL") != null
? ConfigurationManager.AppSettings.Get("BASE_URL").ToString() : "";


        Util util = new Util(BASE_URL);

        public void ProcessRequest(HttpContext context)
        {
            string CLIENT_ID = ConfigurationManager.AppSettings.Get("CLIENT_ID") != null
          ? ConfigurationManager.AppSettings.Get("CLIENT_ID").ToString() : "";
            string CLIENT_SECRET = ConfigurationManager.AppSettings.Get("CLIENT_SECRET") != null
                ? ConfigurationManager.AppSettings.Get("CLIENT_SECRET").ToString() : "";
            string DEFAULT_BUCKET_KEY = ConfigurationManager.AppSettings.Get("DEFAULT_BUCKET_KEY") != null
                ? ConfigurationManager.AppSettings.Get("DEFAULT_BUCKET_KEY").ToString() : "";


            string json = "";
            string message = "";

            string accessToken;

            //TODO: check expiration of access token
            if (context.Session["token"] == null)
            {
                AccessToken token = util.GetAccessToken(CLIENT_ID, CLIENT_SECRET);

                accessToken = token.access_token;
                context.Session["token"] = accessToken;

            }
            accessToken = context.Session["token"].ToString();
            string bucketKey = DEFAULT_BUCKET_KEY;

            //create bucket if not exist
            if (!util.IsBucketExist(bucketKey, accessToken))
            {
                util.CreateBucket(bucketKey, accessToken);
            }


            //only single file supported by now
            if (context.Request.Files.Count > 0)
            {
                HttpFileCollection files = context.Request.Files;
                foreach (string key in files)
                {
                    HttpPostedFile file = files[key];

                    string base64Urn = util.UploadFile(bucketKey, accessToken, file);
                    if (base64Urn != string.Empty) //upload success
                    {
                        message = "File uploaded successfully!";

                        var transSuccess = util.StartTranslation(base64Urn, accessToken);
                        if (transSuccess)
                        {
                            message += " translation started.";
                            //save to session for viewer
                            context.Session["urn"] = base64Urn;

                            json = "{\"urn\": \"" + base64Urn + "\", \"message\":\"" + message + "\",\"status\":\"success\" }";
                        }
                        else
                        {
                            message += " translation failed. ";
                            json = "{\"urn\": \"" + base64Urn + "\", \"message\":\"" + message + "\",\"status\":\"failed\" }";
                        }
                    }
                    else
                    {
                        message = "error when uploading files. ";
                        json = "{\"urn\": \"\", \"message\":\"" + message + "\",\"status\":\"failed\" }";
                    }

                }
            }




            context.Response.ContentType = "text/plain";
            context.Response.Write(json);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}