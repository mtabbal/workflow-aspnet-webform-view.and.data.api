using System;
using ViewerUtil;
using ViewerUtil.Models;

[assembly: log4net.Config.XmlConfigurator(ConfigFile = "Web.config", Watch = true)]
namespace ViewAndShare
{

    public partial class Default : System.Web.UI.Page
    {
        log4net.ILog log = log4net.LogManager.GetLogger(typeof(Default));


        protected void Page_Load(object sender, EventArgs e)
        {


            if (!IsPostBack)
            {
                string BASE_URL = Credentials.BASE_URL;
                string CLIENT_ID = Credentials.CONSUMER_KEY;
                string CLIENT_SECRET = Credentials.CONSUMER_SECRET;
                string DEFAULT_BUCKET_KEY = Credentials.DEFAULT_BUCKET_KEY;

                Util util = new Util(BASE_URL);


                AccessToken token = util.GetAccessToken(CLIENT_ID,
                   CLIENT_SECRET);
                if (token == null)
                {
                    log.Error("Authentication error");

                    //Fatal error
                    Response.Redirect("Error.aspx");
                }
                else
                {
                    log.Info("Authentication success, token : " + token.access_token);
                }



                bool bucketExist = util.IsBucketExist(DEFAULT_BUCKET_KEY, token.access_token);
                if (!bucketExist)
                {
                    util.CreateBucket(DEFAULT_BUCKET_KEY, token.access_token);
                }

            }

        }
    }
}