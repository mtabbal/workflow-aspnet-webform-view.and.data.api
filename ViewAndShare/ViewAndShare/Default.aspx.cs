using System;
using System.Collections.Generic;
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

                Util util = new Util(SecretConstants.BASE_URL);

                if (Session["token"] == null)
                {
                    string token = util.GetAccessToken(SecretConstants.CLIENT_ID,
                       SecretConstants.CLIENT_SECRET).access_token;
                    if (token == string.Empty)
                    {
                        log.Error("Authentication error");
                    }
                    log.Info("Authentication success, token : " + token);
                    Session["token"] = token;
                }

                bool bucketExist = util.IsBucketExist(SecretConstants.DEFAULT_BUCKET_KEY, Session["token"].ToString());
                if (!bucketExist)
                {
                    util.CreateBucket(SecretConstants.DEFAULT_BUCKET_KEY, Session["token"].ToString());
                }

            }

        }
    }
}