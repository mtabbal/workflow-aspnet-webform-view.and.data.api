using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ViewerUtil;

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
                string BASE_URL = ConfigurationManager.AppSettings.Get("BASE_URL") != null
? ConfigurationManager.AppSettings.Get("BASE_URL").ToString() : "";
                string CLIENT_ID = ConfigurationManager.AppSettings.Get("CLIENT_ID") != null
                     ? ConfigurationManager.AppSettings.Get("CLIENT_ID").ToString() : "";
                string CLIENT_SECRET = ConfigurationManager.AppSettings.Get("CLIENT_SECRET") != null
                     ? ConfigurationManager.AppSettings.Get("CLIENT_SECRET").ToString() : "";
                string DEFAULT_BUCKET_KEY = ConfigurationManager.AppSettings.Get("DEFAULT_BUCKET_KEY") != null
           ? ConfigurationManager.AppSettings.Get("DEFAULT_BUCKET_KEY").ToString() : "";

                Util util = new Util(BASE_URL);

                if (Session["token"] == null)
                {
                    string token = util.GetAccessToken(CLIENT_ID,
                       CLIENT_SECRET).access_token;
                    if (token == string.Empty)
                    {
                        log.Error("Authentication error");
                    }
                    log.Info("Authentication success, token : " + token);
                    Session["token"] = token;
                }

                bool bucketExist = util.IsBucketExist(DEFAULT_BUCKET_KEY, Session["token"].ToString());
                if (!bucketExist)
                {
                    util.CreateBucket(DEFAULT_BUCKET_KEY, Session["token"].ToString());
                }

            }

        }
    }
}