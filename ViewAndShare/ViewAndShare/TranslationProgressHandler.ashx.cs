using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using ViewerUtil;
using ViewerUtil.Models;

namespace ViewAndShare
{
    /// <summary>
    /// Summary description for TranslationProgress
    /// </summary>
    public class TranslationProgressHandler : IHttpHandler, IRequiresSessionState
    {
        static string BASE_URL = ConfigurationManager.AppSettings.Get("BASE_URL") != null
? ConfigurationManager.AppSettings.Get("BASE_URL").ToString() : "";
        static string CLIENT_ID = ConfigurationManager.AppSettings.Get("CLIENT_ID") != null
            ? ConfigurationManager.AppSettings.Get("CLIENT_ID").ToString() : "";
        static string CLIENT_SECRET = ConfigurationManager.AppSettings.Get("CLIENT_SECRET") != null
            ? ConfigurationManager.AppSettings.Get("CLIENT_SECRET").ToString() : "";

        Util util = new Util(BASE_URL);

        public void ProcessRequest(HttpContext context)
        {
            var urn = context.Request["urn"];

            string accessToken;
            //TODO: check expiration of access token
            if (context.Session["token"] == null)
            {
                AccessToken tokenObj = util.GetAccessToken(CLIENT_ID, CLIENT_SECRET);

                accessToken = tokenObj.access_token;
                context.Session["token"] = accessToken;

            }

            accessToken = context.Session["token"].ToString();

            string progress = util.GetBubbleCreateProgress(urn, accessToken);
            

            context.Response.ContentType = "text/plain";
            context.Response.Write(progress);
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