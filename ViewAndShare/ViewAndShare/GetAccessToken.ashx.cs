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
    /// Summary description for GetAccessToken
    /// </summary>
    public class GetAccessToken : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            string respJson = string.Empty;

            string BASE_URL = ConfigurationManager.AppSettings.Get("BASE_URL") != null
                ? ConfigurationManager.AppSettings.Get("BASE_URL").ToString() : "";
            string CLIENT_ID = ConfigurationManager.AppSettings.Get("CLIENT_ID") != null
                ? ConfigurationManager.AppSettings.Get("CLIENT_ID").ToString() : "";
            string CLIENT_SECRET = ConfigurationManager.AppSettings.Get("CLIENT_SECRET") != null
                ? ConfigurationManager.AppSettings.Get("CLIENT_SECRET").ToString() : "";

            Util util = new Util(BASE_URL);

            AccessToken token = util.GetAccessToken(CLIENT_ID,CLIENT_SECRET);


            if (context.Session["token"] == null)
            {
                string accessToken = token.access_token;
                if (accessToken == string.Empty)
                {
                    //LogExtensions.Log("Authentication error");
                }
                context.Session["token"] = accessToken;
            }

            respJson = Newtonsoft.Json.JsonConvert.SerializeObject(token);
          
            context.Response.ContentType = "application/json";
            context.Response.Write(respJson);
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