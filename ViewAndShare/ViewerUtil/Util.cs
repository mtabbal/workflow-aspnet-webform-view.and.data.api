﻿using log4net;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using ViewerUtil.Models;

namespace ViewerUtil
{
    public class Util
    {
        private static readonly ILog logger = LogManager.GetLogger(typeof(Util));

        string baseUrl = "";
        RestClient m_client;

        public Util(string baseUrl)
        {
            this.baseUrl = baseUrl;
            m_client = new RestClient(baseUrl);
        }

        public AccessToken GetAccessToken(string clientId, string clientSecret)
        {
            AccessToken token = null;

            RestRequest req = new RestRequest();
            req.Resource = "authentication/v1/authenticate";
            req.Method = Method.POST;
            req.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            req.AddParameter("client_id", clientId);
            req.AddParameter("client_secret", clientSecret);
            req.AddParameter("grant_type", "client_credentials");

            IRestResponse<AccessToken> resp = m_client.Execute<AccessToken>(req);
            logger.Debug(resp.Content);

            if (resp.StatusCode == System.Net.HttpStatusCode.OK)
            {
                AccessToken ar = resp.Data;
                if (ar != null)
                {
                    token = ar;

                }
            }
            return token;
        }


        public bool IsBucketExist(string defaultBucketKey, string accessToken)
        {
            RestRequest req = new RestRequest();

            RestRequest reqCreateBucket = new RestRequest();
            reqCreateBucket.Resource = "oss/v1/buckets" + "/" + defaultBucketKey + "/details";
            reqCreateBucket.Method = Method.GET;
            reqCreateBucket.AddParameter("Authorization", "Bearer " + accessToken, ParameterType.HttpHeader);
            reqCreateBucket.AddParameter("Content-Type", "application/json", ParameterType.HttpHeader);


            IRestResponse<BucketDetails> resp = m_client
                .Execute<BucketDetails>(reqCreateBucket);

            logger.Debug(resp.Content);
            return resp.StatusCode == System.Net.HttpStatusCode.OK;
        }

        public BucketDetails GetBucketDetails(string defaultBucketKey, string accessToken)
        {
            RestRequest req = new RestRequest();

            RestRequest reqCreateBucket = new RestRequest();
            reqCreateBucket.Resource = "oss/v1/buckets" + "/" + defaultBucketKey + "/details";
            reqCreateBucket.Method = Method.GET;
            reqCreateBucket.AddParameter("Authorization", "Bearer " + accessToken, ParameterType.HttpHeader);
            reqCreateBucket.AddParameter("Content-Type", "application/json", ParameterType.HttpHeader);


            IRestResponse<BucketDetails> resp = m_client
                .Execute<BucketDetails>(reqCreateBucket);
            if (resp.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return resp.Data;
            }
            else
            {
                logger.Error("GetBucketDetails error. http code:" + resp.StatusCode);
                logger.Debug(resp.Content);
                return null;
            }
        }

        public bool CreateBucket(string defaultBucketKey, string accessToken)
        {

            RestRequest req = new RestRequest();

            RestRequest reqCreateBucket = new RestRequest();
            reqCreateBucket.Resource = "oss/v1/buckets";
            reqCreateBucket.Method = Method.POST;
            reqCreateBucket.AddParameter("Authorization", "Bearer " + accessToken, ParameterType.HttpHeader);
            reqCreateBucket.AddParameter("Content-Type", "application/json", ParameterType.HttpHeader);

            string body = "{\"bucketKey\":\"" + defaultBucketKey + "\",\"servicesAllowed\":{},\"policy\":\"persistent\"}";

            reqCreateBucket.AddParameter("application/json", body, ParameterType.RequestBody);

            IRestResponse respBC = m_client
                .Execute(reqCreateBucket);

            logger.Debug(respBC.Content);

            return (respBC.StatusCode == System.Net.HttpStatusCode.OK
              || respBC.StatusCode == System.Net.HttpStatusCode.Conflict); // already existed
        }


        public string UploadFile(string bucketKey, string accessToken, HttpPostedFile file)
        {
            string base64URN = string.Empty;

            //Do not use HttpUtility.UrlEncode, bug for charactor '+' 
            //string objectKey = HttpUtility.UrlEncode(file.FileName);

            string objectKey = Uri.EscapeDataString(file.FileName);

            //read the file content
            byte[] fileData = null;
            using (var binaryReader = new BinaryReader(file.InputStream))
            {
                fileData = binaryReader.ReadBytes(file.ContentLength);
            }

            RestRequest req = new RestRequest();
            ///oss/{api version}/buckets/{bucket key}/objects/{object key}
            req.Resource = "oss/v1/buckets/" + bucketKey + "/objects/" + objectKey;
            req.Method = Method.PUT;
            req.AddParameter("Authorization", "Bearer " + accessToken, ParameterType.HttpHeader);
            req.AddParameter("Content-Type", file.ContentType);
            req.AddParameter("Content-Length", file.ContentLength);
            req.AddParameter("requestBody", fileData, ParameterType.RequestBody);

            IRestResponse resp = m_client.Execute(req);
            if (resp.StatusCode == System.Net.HttpStatusCode.OK)
            {
                string content = resp.Content;

                logger.Debug(content);
                //TODO: better way to get ID value from response with Object-Origented way
                var id = GetIdValueInJson(content);
                base64URN = Base64Encode(id);
            }
            return base64URN;
        }

        public bool StartTranslation(string base64URN, string accessToken)
        {
            RestRequest req = new RestRequest();
            //Start translation,
            //viewingservice/v1/register
            req.Resource = "viewingservice/v1/register";
            req.Method = Method.POST;
            req.AddParameter("Authorization", "Bearer " + accessToken, ParameterType.HttpHeader);
            req.AddParameter("Content-Type", "application/json;charset=utf-8", ParameterType.HttpHeader);
            ////force regeneration
            //req.AddParameter("x-ads-force", "true",ParameterType.HttpHeader);
            //// will not trigger a real translation, just respond all parameters for translation.
            //req.AddParameter("x-ads-test", "true", ParameterType.HttpHeader);

            string body = "{\"urn\":\"" + base64URN + "\"}";
            req.AddParameter("application/json", body, ParameterType.RequestBody);

            IRestResponse resp = m_client.Execute(req);
            string content = "";
            if (resp.StatusCode == System.Net.HttpStatusCode.OK)
            {
                content = resp.Content;
                logger.Info(" Translation starting...");

                return true;
            }
            else if (resp.StatusCode == System.Net.HttpStatusCode.Created)
            {
                content = resp.Content;

                logger.Info("Translation has been posted before, it is ready for viewing");
                return true;
            }
            else
            {

                logger.Error("error when trying to tranlate. http code:" + resp.StatusCode);
                logger.Debug(resp.Content);
                return false;
            }
        }

        public string GetTranslationProgress(string base64URN, string accessToken)
        {
            string percentage = "0%";
            RestRequest req = new RestRequest();

            string resource = string.Format("viewingservice/v1/{0}/status", base64URN);
            req.Resource = resource;
            req.Method = Method.GET;
            req.AddParameter("Authorization", "Bearer " + accessToken, ParameterType.HttpHeader);
            req.AddParameter("Content-Type", "application/json;charset=utf-8", ParameterType.HttpHeader);
            ////force regeneration
            //req.AddParameter("x-ads-force", "true",ParameterType.HttpHeader);
            //// will not trigger a real translation, just respond all parameters for translation.
            //req.AddParameter("x-ads-test", "true", ParameterType.HttpHeader);

            IRestResponse<BubbleStatus> resp = m_client.Execute<BubbleStatus>(req);
            if (resp.StatusCode == System.Net.HttpStatusCode.OK
                && resp.Data != null)
            {
                BubbleStatus bt = resp.Data;

                percentage = bt.progress;
            }
            else
            {
                logger.Error("error when getting progress. http code:" + resp.StatusCode);
                logger.Debug(resp.Content);
            }
            return percentage;
        }

        private static string GetIdValueInJson(string content)
        {
            string idSrcFlag = "\"id\" : \"";
            int index = content.IndexOf(idSrcFlag) + idSrcFlag.Length;
            int idLen = content.IndexOf("\"", index + 1) - index;
            var urn = content.Substring(index, idLen);
            return urn;
        }

        public static string Base64Decode(string base64EncodedData)
        {
            byte[] bytes = Convert.FromBase64String(base64EncodedData);
            return Encoding.UTF8.GetString(bytes);
        }

        public static string Base64Encode(string plainText)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(bytes);
        }
    }
}
