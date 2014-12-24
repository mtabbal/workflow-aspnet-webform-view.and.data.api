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
                string BASE_URL = Credentials.BASE_URL; 
                string CLIENT_ID = Credentials.CONSUMER_KEY;
                string CLIENT_SECRET = Credentials.CONSUMER_SECRET;
                string DEFAULT_BUCKET_KEY = Credentials.DEFAULT_BUCKET_KEY; 

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