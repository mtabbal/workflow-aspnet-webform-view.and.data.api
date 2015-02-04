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

        static string BASE_URL = Credentials.BASE_URL;
        string CLIENT_ID = Credentials.CONSUMER_KEY;
        string CLIENT_SECRET = Credentials.CONSUMER_SECRET;


        Util util = new Util(BASE_URL);

        public void ProcessRequest(HttpContext context)
        {
            var urn = context.Request["urn"];

            string accessToken;

            AccessToken tokenObj = util.GetAccessToken(CLIENT_ID, CLIENT_SECRET);
            accessToken = tokenObj.access_token;

            //get the translation progress
            string progress = util.GetTranslationProgress(urn, accessToken);

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